'use client';
import { useState } from 'react'
import { TravelPlan, TravelPlanFormData } from '@/types/travel'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Image as ImageIcon, X, Upload } from 'lucide-react'
import Image from 'next/image'

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
        image: undefined, // Will handle image separately
    }))

    const [previewImage, setPreviewImage] = useState<string | null>(
        initialData?.image || null
    )
    const [selectedImage, setSelectedImage] = useState<File | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        
        if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if (!validTypes.includes(file.type)) {
            alert('Please select a valid image file (JPEG, PNG, GIF, WebP)')
            return
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB')
            return
        }

        setSelectedImage(file)
        
        // Create preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreviewImage(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const removeImage = () => {
        setSelectedImage(null)
        setPreviewImage(null)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        const submitData: TravelPlanFormData = {
            ...formData,
            image: selectedImage || undefined
        }
        
        onSubmit(submitData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload Section */}
            <div className="space-y-4">
                <Label htmlFor="image">Travel Plan Image</Label>
                <div className="space-y-4">
                    {/* Image Preview */}
                    {previewImage && (
                        <div className="relative w-full h-64 rounded-lg overflow-hidden border border-stone-200 bg-stone-50">
                            <Image
                                src={previewImage}
                                alt="Travel plan preview"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    
                    {/* Upload Area */}
                    <div className="relative">
                        <input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <Label
                            htmlFor="image"
                            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all hover:bg-stone-50 ${previewImage ? 'border-stone-300' : 'border-orange-300 bg-orange-50'}`}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                {previewImage ? (
                                    <>
                                        <Upload className="w-8 h-8 text-orange-500 mb-2" />
                                        <p className="text-sm text-orange-600 font-medium">Click to change image</p>
                                    </>
                                ) : (
                                    <>
                                        <ImageIcon className="w-10 h-10 text-orange-400 mb-3" />
                                        <p className="mb-2 text-sm text-stone-600">
                                            <span className="font-semibold text-orange-600">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-stone-500">
                                            PNG, JPG, GIF, WebP (MAX. 5MB)
                                        </p>
                                    </>
                                )}
                            </div>
                        </Label>
                    </div>
                </div>
            </div>

            {/* Destination */}
            <div className="space-y-2">
                <Label htmlFor="destination">Destination *</Label>
                <Input 
                    id="destination" 
                    name="destination" 
                    value={formData.destination} 
                    onChange={handleChange} 
                    required 
                    placeholder="e.g., Paris, France"
                />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input 
                        id="startDate" 
                        type="date" 
                        name="startDate" 
                        value={formData.startDate} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input 
                        id="endDate" 
                        type="date" 
                        name="endDate" 
                        value={formData.endDate} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
            </div>

            {/* Budget */}
            <div className="space-y-2">
                <Label htmlFor="budget">Budget ($)</Label>
                <Input 
                    id="budget" 
                    type="number" 
                    name="budget" 
                    value={formData.budget} 
                    onChange={handleChange} 
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                />
            </div>

            {/* Travel Type */}
            <div className="space-y-2">
                <Label htmlFor="travelType">Travel Type</Label>
                <select
                    id="travelType"
                    name="travelType"
                    className="w-full border border-stone-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400"
                    value={formData.travelType}
                    onChange={handleChange}
                >
                    <option value="Solo">Solo</option>
                    <option value="Family">Family</option>
                    <option value="Group">Group</option>
                    <option value="Couples">Couples</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Business">Business</option>
                    <option value="Backpacking">Backpacking</option>
                    <option value="Luxury">Luxury</option>
                </select>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea 
                    id="description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    className="w-full border border-stone-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400" 
                    rows={4}
                    placeholder="Tell us about your travel plans..."
                />
            </div>

            {/* Visibility */}
            <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="visibility"
                        name="visibility"
                        checked={formData.visibility}
                        onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.checked }))}
                        className="w-4 h-4 text-orange-600 border-stone-300 rounded focus:ring-orange-500"
                    />
                    <Label htmlFor="visibility" className="text-sm text-stone-600 cursor-pointer">
                        Make this plan visible to the community
                    </Label>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button 
                    variant="gradient" 
                    type="submit" 
                    disabled={isSubmitting}
                    className="min-w-[120px]"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Saving...
                        </>
                    ) : initialData ? (
                        'Update Plan'
                    ) : (
                        'Create Plan'
                    )}
                </Button>
            </div>
        </form>
    )
}