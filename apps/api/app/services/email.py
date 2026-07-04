import logging
import smtplib
import asyncio
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Dict, Any, Optional
from datetime import datetime, timezone
from app.core.config import settings
from app.repositories.notification import notification_repository

logger = logging.getLogger("foodbridge.services.email")

def _utcnow() -> datetime:
    return datetime.now(timezone.utc)

class EmailService:
    def __init__(self):
        self.mock_mode = not (settings.SMTP_USER and settings.SMTP_PASS)
        if self.mock_mode:
            logger.info("EmailService initialized in MOCK SMTP mode (no credentials supplied).")
        else:
            logger.info(f"EmailService initialized in PRODUCTION SMTP mode using {settings.SMTP_HOST}:{settings.SMTP_PORT}")

    def _render_html(self, template_type: str, context: Dict[str, Any], gemma_body: Optional[str]) -> str:
        """Applies context variables and Gemma body (if any) to HTML templates."""
        gemma_content = f"<div style='background-color:#f1f8e9; padding:15px; border-left:4px solid #4caf50; font-style:italic; margin:15px 0;'>\"{gemma_body}\"</div>" if gemma_body else ""
        
        base_style = """
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 20px; background-color: #f9fdf9; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 25px; border-radius: 8px; border: 1px solid #e2ebd9; }
            .header { color: #2e7d32; font-size: 20px; font-weight: bold; border-bottom: 2px solid #2e7d32; padding-bottom: 10px; margin-bottom: 20px; }
            .footer { margin-top: 30px; font-size: 11px; color: #777777; border-top: 1px solid #eeeeee; padding-top: 10px; }
            .highlight { color: #2e7d32; font-weight: bold; }
        </style>
        """

        if template_type == "DONATION_ALERT":
            title = "New Surplus Food Donation Alert!"
            body = f"""
            <p>Hello <span class="highlight">{context.get('ngo_name', 'Coordinator')}</span>,</p>
            <p>Gemma, our AI Operations Coordinator, has recommended your organization for a surplus food listing nearby:</p>
            <p><strong>Food Item:</strong> {context.get('food_name')}<br>
            <strong>Quantity:</strong> {context.get('quantity')} {context.get('unit')}<br>
            <strong>Urgency Level:</strong> {context.get('urgency')}</p>
            {gemma_content}
            <p>Log in to your dashboard to submit a pickup appeal if you can collect it.</p>
            """
        elif template_type == "APPEAL_CONFIRMATION":
            title = "Appeal Submitted Successfully"
            body = f"""
            <p>Hello <span class="highlight">{context.get('ngo_name', 'Coordinator')}</span>,</p>
            <p>Your pickup appeal for <strong>{context.get('food_name')}</strong> has been submitted successfully to the donor.</p>
            <p><strong>Your Message:</strong></p>
            <p style="background: #f5f5f5; padding: 10px; border-radius: 4px; font-style: italic;">"{context.get('message')}"</p>
            <p>We will notify you immediately if the donor accepts your appeal.</p>
            """
        elif template_type == "APPEAL_ACCEPTED":
            title = "🎉 Appeal Accepted - Pickup Scheduled!"
            body = f"""
            <p>Hello <span class="highlight">{context.get('ngo_name', 'Coordinator')}</span>,</p>
            <p>Excellent news! The donor has accepted your appeal to collect <strong>{context.get('food_name')}</strong>.</p>
            <p>Please coordinate the collection using the details below:</p>
            <div style="background-color: #e8f5e9; padding: 15px; border-radius: 6px; margin: 15px 0;">
                <strong>Pickup Code:</strong> <span style="font-size: 18px; letter-spacing: 1px; color: #2e7d32; font-weight: bold;">{context.get('pickup_code')}</span><br>
                <strong>Pickup Location:</strong> {context.get('address')}<br>
                <strong>Contact Person:</strong> {context.get('contact_person')} ({context.get('contact_number')})
            </div>
            {gemma_content}
            <p>Present the pickup code to the donor representative upon collection to finalize the impact audit trail.</p>
            """
        elif template_type == "APPEAL_REJECTED":
            title = "Donation Status Update"
            body = f"""
            <p>Hello <span class="highlight">{context.get('ngo_name', 'Coordinator')}</span>,</p>
            <p>Thank you for submitting an appeal for <strong>{context.get('food_name')}</strong>.</p>
            <p>The donor has accepted another matching request for this batch, and the listing is now closed.</p>
            <p>We appreciate your quick response and hope to match you with another surplus listing soon.</p>
            """
        elif template_type == "DONATION_COMPLETED":
            title = "Donation Pickup Finalized"
            body = f"""
            <p>Hello <span class="highlight">{context.get('donor_name', 'Donor Representative')}</span>,</p>
            <p>Your surplus food listing <strong>{context.get('food_name')}</strong> has been successfully picked up by <strong>{context.get('ngo_name')}</strong>.</p>
            <p>The pickup code has been validated and the transaction is closed.</p>
            """
        elif template_type == "THANK_YOU":
            title = "💚 Thank You for Rescuing Food with FoodBridge!"
            body = f"""
            <p>Hello,</p>
            <p>Thank you for completing the rescue flow! By coordinating this surplus delivery, you made a real difference:</p>
            <div style="background-color: #f1f8e9; padding: 15px; border-radius: 6px; margin: 15px 0; font-size: 14px;">
                🌱 <strong>CO2 Emissions Saved:</strong> {context.get('co2_saved', '37.5')} kg<br>
                🍽️ <strong>Approximate Meals Served:</strong> {context.get('meals_served', '30')}
            </div>
            <p>Every small action prevents organic waste and feeds local shelters.</p>
            """
        else:
            title = "FoodBridge Notification"
            body = f"<p>{gemma_body or 'No content supplied.'}</p>"

        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            {base_style}
        </head>
        <body>
            <div class="container">
                <div class="header">{title}</div>
                {body}
                <div class="footer">
                    This is an automated notification from FoodBridge AI Operations Coordinator.<br>
                    &copy; 2026 FoodBridge. All rights reserved.
                </div>
            </div>
        </body>
        </html>
        """.strip()

    def _render_plain_text(self, template_type: str, context: Dict[str, Any], gemma_body: Optional[str]) -> str:
        """Plain text fallback."""
        gemma_txt = f"\nGemma Coordinator Notes:\n\"{gemma_body}\"\n" if gemma_body else ""
        if template_type == "DONATION_ALERT":
            return f"Surplus food available nearby: {context.get('food_name')} ({context.get('quantity')} {context.get('unit')}). {gemma_txt}"
        elif template_type == "APPEAL_ACCEPTED":
            return f"Your appeal for {context.get('food_name')} was accepted! Pickup Code: {context.get('pickup_code')} Location: {context.get('address')} Contact: {context.get('contact_person')}. {gemma_txt}"
        return gemma_body or "Automated FoodBridge Alert."

    async def send_email(
        self,
        recipient: str,
        template_type: str,
        context: Dict[str, Any],
        gemma_body: Optional[str] = None
    ) -> str:
        """Creates a persisted notification and triggers the email dispatcher background task."""
        # 1. Title calculation
        title_map = {
            "DONATION_ALERT": "Surplus Food Alert",
            "APPEAL_CONFIRMATION": "Appeal Submitted Successfully",
            "APPEAL_ACCEPTED": "Appeal Accepted - Pickup Scheduled",
            "APPEAL_REJECTED": "Surplus Listing Status Update",
            "DONATION_COMPLETED": "Donation Collection Complete",
            "THANK_YOU": "Thank You for Rescuing Food!"
        }
        title = title_map.get(template_type, "FoodBridge Notification")
        
        # 2. Persist notification in DB (status: unread, delivery_status: PENDING)
        plain_text = self._render_plain_text(template_type, context, gemma_body)
        notif = await notification_repository.create(
            recipient=recipient,
            title=title,
            message=plain_text
        )
        notif_id = notif["id"]

        # 3. Fire and forget async dispatcher task (retry queue)
        asyncio.create_task(
            self._dispatch_with_retry(notif_id, recipient, title, template_type, context, gemma_body)
        )
        return notif_id

    async def _dispatch_with_retry(
        self,
        notif_id: str,
        recipient: str,
        title: str,
        template_type: str,
        context: Dict[str, Any],
        gemma_body: Optional[str],
        max_retries: int = 3,
        backoff_base_sec: float = 2.0
    ):
        """Dispatches emails with exponential retry queue logic."""
        html_content = self._render_html(template_type, context, gemma_body)
        text_content = self._render_plain_text(template_type, context, gemma_body)

        for attempt in range(1, max_retries + 1):
            try:
                if self.mock_mode:
                    # Mock SMTP success
                    await asyncio.sleep(0.1)  # simulate delay
                    logger.info(f"[MOCK SMTP] Dispatched to {recipient} - '{title}' (Attempt {attempt})")
                    await notification_repository.update_delivery_status(notif_id, "SENT")
                    return

                # Real SMTP dispatch
                await asyncio.to_thread(
                    self._smtp_send_sync, recipient, title, html_content, text_content
                )
                logger.info(f"[SMTP SUCCESS] Dispatched to {recipient} - '{title}'")
                await notification_repository.update_delivery_status(notif_id, "SENT")
                return

            except Exception as e:
                logger.warning(f"SMTP dispatch failure (Attempt {attempt}/{max_retries}) to {recipient}: {e}")
                if attempt == max_retries:
                    logger.error(f"[SMTP FAIL] Permanent dispatch failure to {recipient} for notification {notif_id}")
                    await notification_repository.update_delivery_status(notif_id, "FAILED")
                else:
                    sleep_sec = backoff_base_sec ** attempt
                    await asyncio.sleep(sleep_sec)

    def _smtp_send_sync(self, recipient: str, subject: str, html: str, text: str):
        """Synchronous smtplib block wrapped in asyncio.to_thread."""
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = settings.SMTP_USER
        msg["To"] = recipient

        msg.attach(MIMEText(text, "plain"))
        msg.attach(MIMEText(html, "html"))

        # Setup SMTP
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
            server.starttls()
            server.login(settings.SMTP_USER, settings.SMTP_PASS)
            server.sendmail(settings.SMTP_USER, recipient, msg.as_string())

email_service = EmailService()
