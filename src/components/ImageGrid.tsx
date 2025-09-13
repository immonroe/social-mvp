'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { CreateBoardModal } from './CreateBoardModal'
import { useBoards } from '@/contexts/BoardContext'
import { Heart, Bookmark, Share } from 'lucide-react'

// Fixed image IDs to ensure consistency between grid and modal views
const SAMPLE_IMAGES = [
  { id: 1, url: 'https://picsum.photos/id/10/300/400', title: 'Mountain Landscape' },
  { id: 2, url: 'https://picsum.photos/id/20/300/500', title: 'Ocean Sunset' },
  { id: 3, url: 'https://picsum.photos/id/30/300/350', title: 'City Architecture' },
  { id: 4, url: 'https://picsum.photos/id/40/300/450', title: 'Forest Path' },
  { id: 5, url: 'https://picsum.photos/id/50/300/400', title: 'Desert Dunes' },
  { id: 6, url: 'https://picsum.photos/id/60/300/500', title: 'Flower Garden' },
  { id: 7, url: 'https://picsum.photos/id/70/300/380', title: 'Beach Waves' },
  { id: 8, url: 'https://picsum.photos/id/80/300/420', title: 'Snow Mountains' },
  { id: 9, url: 'https://picsum.photos/id/90/300/460', title: 'Urban Street' },
  { id: 10, url: 'https://picsum.photos/id/100/300/400', title: 'Lake Reflection' },
  { id: 11, url: 'https://picsum.photos/id/110/300/500', title: 'Autumn Leaves' },
  { id: 12, url: 'https://picsum.photos/id/120/300/350', title: 'Starry Night' },
  { id: 13, url: 'https://picsum.photos/id/130/300/480', title: 'Garden Flowers' },
  { id: 14, url: 'https://picsum.photos/id/140/300/420', title: 'City Lights' },
  { id: 15, url: 'https://picsum.photos/id/150/300/390', title: 'River Valley' },
  { id: 16, url: 'https://picsum.photos/id/160/300/440', title: 'Sunset Glow' },
  { id: 17, url: 'https://picsum.photos/id/170/300/360', title: 'Ocean Waves' },
  { id: 18, url: 'https://picsum.photos/id/180/300/520', title: 'Mountain Peak' },
  { id: 19, url: 'https://picsum.photos/id/190/300/400', title: 'Urban Art' },
  { id: 20, url: 'https://picsum.photos/id/200/300/450', title: 'Forest Trail' },
  { id: 21, url: 'https://picsum.photos/id/210/300/370', title: 'Coastal View' },
  { id: 22, url: 'https://picsum.photos/id/220/300/490', title: 'Prairie Grass' },
  { id: 23, url: 'https://picsum.photos/id/230/300/410', title: 'Rocky Cliffs' },
  { id: 24, url: 'https://picsum.photos/id/240/300/380', title: 'Misty Morning' },
  { id: 25, url: 'https://picsum.photos/id/250/300/460', title: 'Golden Hour' },
  { id: 26, url: 'https://picsum.photos/id/260/300/500', title: 'Wildflowers' },
  { id: 27, url: 'https://picsum.photos/id/270/300/330', title: 'Stone Bridge' },
  { id: 28, url: 'https://picsum.photos/id/280/300/470', title: 'Peaceful Lake' },
  { id: 29, url: 'https://picsum.photos/id/290/300/440', title: 'Mountain Stream' },
  { id: 30, url: 'https://picsum.photos/id/300/300/390', title: 'Desert Bloom' },
  { id: 31, url: 'https://picsum.photos/id/310/300/420', title: 'Cloudy Sky' },
  { id: 32, url: 'https://picsum.photos/id/320/300/480', title: 'Forest Canopy' },
  { id: 33, url: 'https://picsum.photos/id/330/300/400', title: 'Ocean Depth' },
  { id: 34, url: 'https://picsum.photos/id/340/300/450', title: 'City Skyline' },
  { id: 35, url: 'https://picsum.photos/id/350/300/380', title: 'Country Road' },
  { id: 36, url: 'https://picsum.photos/id/360/300/520', title: 'Sunrise View' },
  { id: 37, url: 'https://picsum.photos/id/370/300/360', title: 'Waterfall' },
  { id: 38, url: 'https://picsum.photos/id/380/300/430', title: 'Meadow Path' },
  { id: 39, url: 'https://picsum.photos/id/390/300/470', title: 'Canyon Wall' },
  { id: 40, url: 'https://picsum.photos/id/400/300/400', title: 'Peaceful Valley' },
  { id: 41, url: 'https://picsum.photos/id/410/300/350', title: 'Storm Clouds' },
  { id: 42, url: 'https://picsum.photos/id/420/300/490', title: 'Gentle Hills' },
  { id: 43, url: 'https://picsum.photos/id/430/300/410', title: 'Ancient Tree' },
  { id: 44, url: 'https://picsum.photos/id/440/300/460', title: 'Crystal Lake' },
  { id: 45, url: 'https://picsum.photos/id/450/300/380', title: 'Winding River' },
  { id: 46, url: 'https://picsum.photos/id/460/300/440', title: 'Mountain Trail' },
  { id: 47, url: 'https://picsum.photos/id/470/300/500', title: 'Ocean Horizon' },
  { id: 48, url: 'https://picsum.photos/id/480/300/370', title: 'Forest Floor' },
  { id: 49, url: 'https://picsum.photos/id/490/300/420', title: 'Desert Vista' },
  { id: 50, url: 'https://picsum.photos/id/500/300/450', title: 'Coastal Path' },
]

export function ImageGrid() {
  const [selectedImage, setSelectedImage] = useState<typeof SAMPLE_IMAGES[0] | null>(null)
  const [showCreateBoard, setShowCreateBoard] = useState(false)
  const [comment, setComment] = useState('')
  const { boards, createBoard, savePinToBoard, addComment, comments } = useBoards()

  return (
    <>
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
        {SAMPLE_IMAGES.map((image) => (
          <div 
            key={image.id} 
            className="break-inside-avoid bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image.url}
              alt={image.title}
              width={300}
              height={400}
              className="w-full h-auto hover:opacity-95 transition-opacity"
            />
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
                key={selectedImage.id} // Force re-render with same image
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
                <h3 className="font-semibold text-gray-900">Save to board</h3>
                <div className="grid grid-cols-2 gap-2">
                  {boards.map((board) => (
                    <Button 
                      key={board.id} 
                      variant="outline" 
                      size="sm" 
                      className="justify-start"
                      onClick={() => {
                        savePinToBoard(
                          selectedImage.id.toString(), 
                          board.id, 
                          selectedImage.url, 
                          selectedImage.title
                        )
                        alert(`Saved to ${board.name}!`)
                      }}
                    >
                      <Bookmark className="w-4 h-4 mr-2" />
                      {board.name}
                    </Button>
                  ))}
                </div>
                <Button 
                  className="w-full"
                  onClick={() => setShowCreateBoard(true)}
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  Create New Board
                </Button>
              </div>

              {/* Comments Section */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Comments</h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {(comments[selectedImage.id.toString()] || []).map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                          {comment.author.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium">{comment.author}</span>
                      </div>
                      <p className="text-sm text-gray-800">{comment.text}</p>
                    </div>
                  ))}
                  
                  {(!comments[selectedImage.id.toString()] || comments[selectedImage.id.toString()].length === 0) && (
                    <p className="text-gray-500 text-sm text-center py-4">No comments yet. Be the first to comment!</p>
                  )}
                </div>
                
                {/* Add Comment */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && comment.trim()) {
                        addComment(selectedImage.id.toString(), comment.trim())
                        setComment('')
                      }
                    }}
                  />
                  <Button 
                    size="sm"
                    onClick={() => {
                      if (comment.trim()) {
                        addComment(selectedImage.id.toString(), comment.trim())
                        setComment('')
                      }
                    }}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Board Modal */}
      <CreateBoardModal
        isOpen={showCreateBoard}
        onClose={() => setShowCreateBoard(false)}
        onCreateBoard={(name, description) => {
          createBoard(name, description)
          alert(`Board "${name}" created successfully!`)
        }}
      />
    </>
  )
}
