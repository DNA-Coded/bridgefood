# FoodBridge AI
> **Every Meal Saved is Another Family Fed**

---

## Inspiration

Every night, two completely different stories unfold in every city.

At one end of the city, a restaurant owner finishes serving customers after a long day. The kitchen still holds trays of freshly prepared meals—food that is safe, nutritious, and prepared with care. Health regulations and operational constraints prevent the restaurant from serving it the next day. With no reliable way to quickly find someone who needs it, the food is eventually thrown away.

At the very same time, only a few kilometers away, volunteers at an NGO, community kitchen, or homeless shelter are struggling to arrange enough meals for the people waiting outside. Families, children, and elderly people wait in hope, while volunteers make phone calls, search for donations, and stretch limited resources as far as possible.

The heartbreaking reality is that these two worlds exist side by side every single day. One has food; the other has hunger. Yet they rarely meet.

The problem is not food production. **The problem is coordination.**

Existing food donation platforms primarily function as listing websites or communication tools. They still depend heavily on manual phone calls, messaging groups, spreadsheets, and human judgment. Volunteers spend valuable time verifying whether food is still safe, estimating quantities, checking allergens, finding suitable recipient organizations, and coordinating pickups. For highly perishable food, every minute lost significantly reduces the chance that the donation can be rescued.

We believed there had to be a better approach. Instead of asking volunteers to perform all of these decisions manually, we asked a different question:

> *What if Artificial Intelligence could become the operational coordinator that connects surplus food with the people who need it before it becomes waste?*

That single question became the foundation of **FoodBridge AI**.

FoodBridge AI is not another food delivery application, an e-commerce platform, or a logistics company. Instead, it is an intelligent coordination platform that enables restaurants, hotels, supermarkets, warehouses, caterers, event organizers, and individuals to quickly register surplus food before it expires.

Once a donation is created, Gemma becomes the intelligence behind the entire process. Gemma analyzes uploaded food images together with the donor's description, estimates the quantity, predicts freshness and remaining shelf life, identifies possible allergens, evaluates urgency, recommends the most suitable recipient organizations, generates multilingual summaries, and prepares outreach emails to accelerate communication.

Rather than replacing human decision-making, Gemma removes repetitive operational work so that donors and NGOs can focus on what truly matters—getting food to people before it is wasted.

Our vision extends beyond reducing food waste. We want to build a future where technology quietly coordinates acts of kindness, making surplus food a predictable community resource instead of a daily environmental and humanitarian loss. 

---

## How We Built It

From the very beginning, we wanted FoodBridge AI to be more than a traditional web application with an AI chatbot attached to it. Instead, we designed the entire platform around a simple architectural principle:

> **Every important operational decision should first be understood, reasoned about, and validated by Gemma before it reaches the application logic.**

This philosophy shaped every layer of our system. The application follows a production-oriented, modular architecture consisting of a React frontend, a FastAPI backend, MongoDB Atlas for persistent storage, and a dedicated AI orchestration layer powered by Gemma.

```
[Donor Upload] ➔ [Gemma Vision Analysis] ➔ [Safety & Expiration Verification] ➔ [Explainable NGO Routing] ➔ [Automated Notification]
```

### Frontend Architecture
The frontend was developed using **React, TypeScript, Vite, Tailwind CSS, and Zustand**, providing a fast, responsive, and accessible interface. We intentionally designed the user experience to resemble a professional humanitarian operations platform rather than a futuristic AI application. The technology quietly assists users instead of overwhelming them.

### Backend Architecture
The backend was built using **FastAPI** because of its asynchronous architecture, excellent type safety, and seamless integration with Python's AI ecosystem. Business logic is organized using the Repository Pattern and Service Layer architecture, ensuring complete separation between API endpoints, business rules, database operations, and AI orchestration.

### Persistence Layer
**MongoDB Atlas** serves as the central data store for food listings, recipient organizations, donation requests, AI reports, notifications, and platform analytics. Geospatial indexing and optimized query structures support intelligent organization discovery and future scalability.

### Gemma AI Orchestrator & Structured Outputs
One of the biggest engineering challenges was ensuring that AI responses could be trusted inside an operational system. Large Language Models naturally generate conversational text, but business applications require predictable machine-readable outputs.

To solve this problem, we designed a structured prompting pipeline. Instead of asking Gemma to "describe the food," every prompt instructs the model to return well-defined JSON following strict schemas. Those responses are then validated using **Pydantic v2** before entering the application's service layer. If validation fails, fallback handlers ensure that invalid AI outputs never break the donation workflow.

---

## Gemma's Unique Contribution

Gemma is the core intelligence that powers the application itself throughout the complete donation lifecycle.

### 1. Multimodal Food Understanding
Immediately after a donor submits a listing, Gemma combines uploaded photographs with textual information. It identifies the likely food category, estimates approximate quantity, predicts the number of servings, and extracts structured operational metadata from unstructured human inputs.

### 2. Food Safety & Urgency Assessment
Gemma assists donors and receivers by estimating:
- Remaining shelf life and freshness window.
- Potential allergens based on contextual analysis.
- Operational donation urgency (e.g. mapping perishability categories to risk levels).

### 3. Intelligent Recipient Recommendation
Selecting the nearest organization is not always the best decision; a shelter might lack refrigeration, or a food bank might be operating at full capacity. Gemma reasons across multiple operational factors:
- Food category & quantity constraints.
- Remaining shelf life & pickup urgency.
- Organization capabilities, storage facilities, and pickup readiness.
Gemma ranks recipient organizations according to compatibility rather than simple proximity and provides transparent, human-readable explanations describing why each recommendation was made.

### 4. Multilingual Communication & Outreach
To break down language barriers in emergency food coordination, Gemma automatically generates donation summaries in **English, Hindi, and Bengali**. It also prepares professional email drafts containing descriptions, quantities, urgency, and recommended pickup windows, making outreach nearly instantaneous.

### 5. Explainable AI (XAI)
To build confidence among volunteers, Gemma provides structured reasoning explaining how each conclusion was reached (e.g., why a donation received a high-urgency rating, or why a specific NGO was recommended/excluded).

---

## The AI Pipeline Workflow

```
[Donor Upload]
      ↓
[Gemma Multimodal Vision Analysis]
      ↓
[Structured Information Extraction]
      ↓
[Food Safety & Expiration Validation]
      ↓
[Urgency & Impact Estimation]
      ↓
[Recipient Organization Recommendation]
      ↓
[Multilingual Summary Generation (EN, HI, BN)]
      ↓
[Outreach Email Draft Generation]
      ↓
[Receiver Appeal & Verification]
      ↓
[Food Pickup & Impact Delivery]
```

---

## Challenges We Ran Into

- **Designing AI as the Core Product**: We avoided using AI as a sidebar chatbot. Every listing must pass through an automated validation pipeline before entering the system. This required restructuring the database schema and application controllers to handle asynchronous state states during AI evaluation.
- **Data Validation & Type Safety**: Converting messy real-world text into structured schema-validated data was solved by utilizing strict JSON prompts and validating inputs at runtime using **Pydantic v2** with robust fallbacks.
- **Explainability**: Explaining why organizations were matched or excluded required prompt iterations that isolated structural rules (like refrigeration capacity) and forced the LLM to output explicit rationale.
- **Database & Networking**: Encountered connection and indexing errors with MongoDB Atlas during geospatial indexing. We successfully implemented database schema cleanup scripts and Whitelisted correct IPs to resolve connection blocks.

---

## Future Scope & Conclusion

Technology is often celebrated for making life more convenient; we wanted to build technology that makes society more compassionate. Behind every rescued meal is a human story. 

### Future Roadmap
1. **Real-Time Organization Discovery**: Dynamically indexing and validating recipient registries using public databases.
2. **Predictive Food Waste Analytics**: Providing restaurants and donors with historical insights on overproduction to reduce waste before it happens.
3. **Disaster and Emergency Response**: Adapting the coordinator to direct emergency supplies during humanitarian crises.
4. **Expanded Regional Language Support**: Supporting more localized Indian languages to improve accessibility for local volunteers.
5. **ESG Sustainability Reporting**: Generating verifiable audits detailing carbon offset metrics and meals rescued.

FoodBridge AI demonstrates how Generative AI can move beyond conversation and become an active participant in solving real-world humanitarian challenges. Every meal saved is another family fed.
