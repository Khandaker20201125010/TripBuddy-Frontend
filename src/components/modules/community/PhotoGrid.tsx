/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { PhotoCard } from "./PhotoCard";
import { UserPhotoGroup } from "@/types/commnunity";

interface PhotoGridProps {
  groupedPhotos: UserPhotoGroup[];
  onPhotoClick: (photo: any, groupPhotos: any[]) => void;
}

export function PhotoGrid({ groupedPhotos, onPhotoClick }: PhotoGridProps) {
  if (groupedPhotos.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-stone-500 text-lg">
          No photos found. Share your first adventure!
        </p>
      </div>
    );
  }

  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 px-4 md:px-0 pb-20">
      {groupedPhotos.map((group) => (
        <PhotoCard 
          key={group.userId} 
          photoGroup={group} 
          onPhotoClick={onPhotoClick} 
        />
      ))}
    </div>
  );
}