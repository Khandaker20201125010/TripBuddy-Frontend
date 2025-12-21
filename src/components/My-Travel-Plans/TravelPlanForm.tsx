'use client';
import { useState } from 'react'
import { TravelPlan, TravelPlanFormData } from '@/types/travel'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

interface Props {
    initialData?: TravelPlan
    onSubmit: (data: TravelPlanFormData) => void
    onCancel: () => void
    isSubmitting?: boolean
}

export function TravelPlanForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: Props) {
    const [formData, setFormData] = useState<TravelPlanFormData>(() => ({
        destination: initialData?.destination ?? '',
        startDate: initialData?.startDate ? initialData.startDate.split('T')[0] : '',
        endDate: initialData?.endDate ? initialData.endDate.split('T')[0] : '',
        budget: initialData?.budget ?? 0,
        travelType: initialData?.travelType ?? 'Solo',
        description: initialData?.description ?? '',
        visibility: initialData?.visibility ?? true,
    }))

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <form onSubmit={e => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
            <div className="space-y-1">
                <Label htmlFor="destination">Destination</Label>
                <Input id="destination" name="destination" value={formData.destination} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
                </div>
            </div>

            <div className="space-y-1">
                <Label htmlFor="travelType">Travel Type</Label>
                <select
                    id="travelType"
                    name="travelType"
                    className="w-full border rounded-md px-3 py-2 bg-white"
                    value={formData.travelType}
                    onChange={handleChange}
                >
                    {/* FIXED: Values are now capitalized to match search tags */}
                    <option value="Solo">Solo</option>
                    <option value="Family">Family</option>
                    <option value="Group">Group</option>
                    <option value="Couples">Couples</option>
                    <option value="Adventure">Adventure</option>
                </select>
            </div>

            <div className="space-y-1">
                <Label htmlFor="description">Description</Label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="w-full border rounded-md px-3 py-2" rows={4} />
            </div>

            <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : initialData ? 'Update Plan' : 'Create Plan'}
                </Button>
            </div>
        </form>
    )
}