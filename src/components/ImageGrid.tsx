'use client'

import Image from 'next/image'
import Link from 'next/link'

const SAMPLE_IMAGES = [
  { id: 1, url: 'https://picsum.photos/300/400?random=1', title: 'Mountain Landscape' },
  { id: 2, url: 'https://picsum.photos/300/500?random=2', title: 'Ocean View' },
  { id: 3, url: 'https://picsum.photos/300/350?random=3', title: 'City Architecture' },
  { id: 4, url: 'https://picsum.photos/300/450?random=4', title: 'Forest Path' },
  { id: 5, url: 'https://picsum.photos/300/400?random=5', title: 'Desert Sunset' },
  { id: 6, url: 'https://picsum.photos/300/500?random=6', title: 'Flower Garden' },
  { id: 7, url: 'https://picsum.photos/300/380?random=7', title: 'Beach Waves' },
  { id: 8, url: 'https://picsum.photos/300/420?random=8', title: 'Snow Mountains' },
  { id: 9, url: 'https://picsum.photos/300/460?random=9', title: 'Urban Street' },
  { id: 10, url: 'https://picsum.photos/300/400?random=10', title: 'Lake Reflection' },
  { id: 11, url: 'https://picsum.photos/300/500?random=11', title: 'Autumn Leaves' },
  { id: 12, url: 'https://picsum.photos/300/350?random=12', title: 'Starry Night' },
]

export function ImageGrid() {
  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
      {SAMPLE_IMAGES.map((image) => (
        <div key={image.id} className="break-inside-avoid bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
          <Image
            src={image.url}
            alt={image.title}
            width={300}
            height={400}
            className="w-full h-auto"
          />
          <div className="p-3">
            <h3 className="text-sm font-medium text-gray-900">{image.title}</h3>
          </div>
        </div>
      ))}
    </div>
  )
}
