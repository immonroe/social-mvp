'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Heart, Bookmark, Share } from 'lucide-react'

// Generate 50 diverse images with varied heights for authentic Pinterest masonry layout
const generateImages = () => {
  const titles = [
    'Mountain Landscape', 'Ocean Sunset', 'City Architecture', 'Forest Path', 'Desert Dunes',
    'Flower Garden', 'Beach Waves', 'Snow Mountains', 'Urban Street', 'Lake Reflection',
    'Autumn Leaves', 'Starry Night', 'Garden Flowers', 'City Lights', 'River Valley',
    'Sunset Glow', 'Ocean Waves', 'Mountain Peak', 'Urban Art', 'Forest Trail',
    'Coastal View', 'Prairie Grass', 'Rocky Cliffs', 'Misty Morning', 'Golden Hour',
    'Wildflowers', 'Stone Bridge', 'Peaceful Lake', 'Mountain Stream', 'Desert Bloom',
    'Cloudy Sky', 'Forest Canopy', 'Ocean Depth', 'City Skyline', 'Country Road',
    'Sunrise View', 'Waterfall', 'Meadow Path', 'Canyon Wall', 'Peaceful Valley',
    'Storm Clouds', 'Gentle Hills', 'Ancient Tree', 'Crystal Lake', 'Winding River',
    'Mountain Trail', 'Ocean Horizon', 'Forest Floor', 'Desert Vista', 'Coastal Path'
  ]
  
  const heights = [350, 400, 450, 380, 420, 500, 360, 440, 480, 390, 460, 520, 370, 410, 490]
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    url: `https://picsum.photos/300/${heights[i % heights.length]}?random=${i + 1}`,
    title: titles[i % titles.length]
  }))
}

const SAMPLE_IMAGES = generateImages()

export function ImageGrid() {
  const [selectedImage, setSelectedImage] = useState<typeof SAMPLE_IMAGES[0] | null>(null)

  return (
    <>
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
        {SAMPLE_IMAGES.map((image) => (
          <div 
            key={image.id} 
            className="break-inside-avoid bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer group relative"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image.url}
              alt={image.title}
              width={300}
              height={400}
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
          </div>
        ))}
      </div>

      {/* Image Detail Modal */}
      {selectedImage && (
        <Modal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          className="max-w-4xl w-full mx-4"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            <div className="flex-1">
              <Image
                src={selectedImage.url}
                alt={selectedImage.title}
                width={500}
                height={600}
                className="w-full h-auto rounded-lg"
              />
            </div>

            {/* Details Panel */}
            <div className="w-full md:w-80 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Pin #{selectedImage.id}</h2>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Save to Board */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Save to board</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['Travel', 'Home Decor', 'Recipes', 'Art & Design'].map((board) => (
                    <Button key={board} variant="outline" size="sm" className="justify-start">
                      <Bookmark className="w-4 h-4 mr-2" />
                      {board}
                    </Button>
                  ))}
                </div>
                <Button className="w-full">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Create New Board
                </Button>
              </div>

              {/* Comments Section */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Comments</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                        J
                      </div>
                      <span className="text-sm font-medium">john_doe</span>
                    </div>
                    <p className="text-sm text-gray-700">Beautiful shot! Love the composition.</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                        S
                      </div>
                      <span className="text-sm font-medium">sarah_m</span>
                    </div>
                    <p className="text-sm text-gray-700">Adding this to my inspiration board!</p>
                  </div>
                </div>
                
                {/* Add Comment */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <Button size="sm">Post</Button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
