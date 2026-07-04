import React from 'react';
import { FormField } from '../../forms/FormField';
import { FormLabel } from '../../forms/FormLabel';
// FormMessage reserved for future validation UI
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Button } from './Button';

export interface DonationFormData {
  title: string;
  category: string;
  foodType: string;
  description: string;
  isVegetarian: string;
  allergens: string;
  quantity: string;
  unit: string;
  servings: string;
  prepDate: string;
  bestBefore: string;
  pickupAddress: string;
  contactPerson: string;
  contactNumber: string;
  specialInstructions: string;
}

interface DonationFormProps {
  formData: DonationFormData;
  onChange: (data: Partial<DonationFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  errors: Record<string, string>;
}

export const DonationForm: React.FC<DonationFormProps> = ({
  formData,
  onChange,
  onSubmit,
  onReset,
  errors
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Basic Details Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-primary">1. Shipment Information</h3>
        <FormField>
          <FormLabel htmlFor="title">Donation Title *</FormLabel>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Cooked Saffron Rice & Curry"
            error={errors.title}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField>
            <FormLabel htmlFor="category">Category *</FormLabel>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="cooked">Cooked Food</option>
              <option value="packaged">Packaged / Pantry</option>
              <option value="raw">Raw / Fresh Produce</option>
            </select>
          </FormField>

          <FormField>
            <FormLabel htmlFor="foodType">Food Type</FormLabel>
            <Input
              id="foodType"
              name="foodType"
              value={formData.foodType}
              onChange={handleChange}
              placeholder="e.g. Catering leftover"
            />
          </FormField>
        </div>

        <FormField>
          <FormLabel htmlFor="description">Description & Shelf-life Info *</FormLabel>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the food condition, packaging, storage, and preparation timing..."
            error={errors.description}
          />
        </FormField>
      </div>

      {/* Diet & Quantity Section */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-sm font-bold uppercase tracking-wider text-primary">2. Food Specifications</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField>
            <FormLabel htmlFor="isVegetarian">Diet Type</FormLabel>
            <select
              id="isVegetarian"
              name="isVegetarian"
              value={formData.isVegetarian}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="vegetarian">Vegetarian</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
            </select>
          </FormField>

          <FormField>
            <FormLabel htmlFor="allergens">Allergen Warnings</FormLabel>
            <Input
              id="allergens"
              name="allergens"
              value={formData.allergens}
              onChange={handleChange}
              placeholder="e.g. Nuts, Dairy, Gluten"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField>
            <FormLabel htmlFor="quantity">Quantity *</FormLabel>
            <Input
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="15"
              error={errors.quantity}
            />
          </FormField>

          <FormField>
            <FormLabel htmlFor="unit">Unit</FormLabel>
            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="kg">Kg</option>
              <option value="servings">Servings</option>
              <option value="units">Units</option>
            </select>
          </FormField>

          <FormField>
            <FormLabel htmlFor="servings">No. of Servings</FormLabel>
            <Input
              id="servings"
              name="servings"
              value={formData.servings}
              onChange={handleChange}
              placeholder="e.g. 30"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField>
            <FormLabel htmlFor="prepDate">Prep Date & Time</FormLabel>
            <Input
              id="prepDate"
              name="prepDate"
              type="datetime-local"
              value={formData.prepDate}
              onChange={handleChange}
            />
          </FormField>
          <FormField>
            <FormLabel htmlFor="bestBefore">Best Before Expiry *</FormLabel>
            <Input
              id="bestBefore"
              name="bestBefore"
              type="datetime-local"
              value={formData.bestBefore}
              onChange={handleChange}
              error={errors.bestBefore}
            />
          </FormField>
        </div>
      </div>

      {/* Pickup Details Section */}
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-sm font-bold uppercase tracking-wider text-primary">3. Pickup & Contact Info</h3>
        <FormField>
          <FormLabel htmlFor="pickupAddress">Pickup Location Address *</FormLabel>
          <Input
            id="pickupAddress"
            name="pickupAddress"
            value={formData.pickupAddress}
            onChange={handleChange}
            placeholder="e.g. 123 Main St, Suite 400"
            error={errors.pickupAddress}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField>
            <FormLabel htmlFor="contactPerson">Contact Representative *</FormLabel>
            <Input
              id="contactPerson"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              error={errors.contactPerson}
            />
          </FormField>

          <FormField>
            <FormLabel htmlFor="contactNumber">Contact Phone Number *</FormLabel>
            <Input
              id="contactNumber"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="e.g. +1 555-0199"
              error={errors.contactNumber}
            />
          </FormField>
        </div>

        <FormField>
          <FormLabel htmlFor="specialInstructions">Special Pickup Instructions</FormLabel>
          <Textarea
            id="specialInstructions"
            name="specialInstructions"
            value={formData.specialInstructions}
            onChange={handleChange}
            placeholder="e.g. Enter through side loading dock gate."
          />
        </FormField>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <Button type="submit" variant="primary" className="flex-1">
          Create Assessment Report
        </Button>
        <Button type="button" variant="outline" onClick={onReset}>
          Reset Form
        </Button>
      </div>
    </form>
  );
};
