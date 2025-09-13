'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { CreateBoardModal } from './CreateBoardModal'
import { useBoards } from '@/contexts/BoardContext'
import { Heart, Bookmark, Share } from 'lucide-react'

// Pinterest-style mock content with realistic categories and descriptions
const SAMPLE_IMAGES = [
  // Home & Interior Design
  { id: 1, url: 'https://picsum.photos/600/800?random=1', title: 'Modern Living Room Ideas', category: 'Home Decor' },
  { id: 2, url: 'https://picsum.photos/600/1000?random=2', title: 'Cozy Bedroom Design', category: 'Interior Design' },
  { id: 3, url: 'https://picsum.photos/600/700?random=3', title: 'Minimalist Kitchen', category: 'Kitchen Ideas' },
  { id: 4, url: 'https://picsum.photos/600/900?random=4', title: 'Bathroom Renovation', category: 'Bathroom Design' },
  { id: 5, url: 'https://picsum.photos/600/800?random=5', title: 'Small Space Solutions', category: 'Apartment Living' },
  
  // Food & Recipes
  { id: 6, url: 'https://picsum.photos/600/1000?random=6', title: 'Healthy Breakfast Bowl', category: 'Healthy Recipes' },
  { id: 7, url: 'https://picsum.photos/600/760?random=7', title: 'Homemade Pizza Recipe', category: 'Italian Food' },
  { id: 8, url: 'https://picsum.photos/600/840?random=8', title: 'Chocolate Cake Recipe', category: 'Desserts' },
  { id: 9, url: 'https://picsum.photos/600/920?random=9', title: 'Fresh Pasta Ideas', category: 'Pasta Recipes' },
  { id: 10, url: 'https://picsum.photos/600/800?random=10', title: 'Smoothie Bowl Recipe', category: 'Healthy Drinks' },
  
  // Fashion & Style
  { id: 11, url: 'https://picsum.photos/600/1000?random=11', title: 'Summer Outfit Ideas', category: 'Fashion' },
  { id: 12, url: 'https://picsum.photos/600/700?random=12', title: 'Casual Friday Look', category: 'Work Fashion' },
  { id: 13, url: 'https://picsum.photos/600/960?random=13', title: 'Wedding Guest Outfit', category: 'Special Occasions' },
  { id: 14, url: 'https://picsum.photos/600/840?random=14', title: 'Accessories Styling', category: 'Jewelry' },
  { id: 15, url: 'https://picsum.photos/600/780?random=15', title: 'Winter Coat Ideas', category: 'Winter Fashion' },
  
  // Travel & Places
  { id: 16, url: 'https://picsum.photos/600/880?random=16', title: 'Santorini Travel Guide', category: 'Greece Travel' },
  { id: 17, url: 'https://picsum.photos/600/720?random=17', title: 'Tokyo Street Food', category: 'Japan Travel' },
  { id: 18, url: 'https://picsum.photos/600/1040?random=18', title: 'Paris Hidden Gems', category: 'France Travel' },
  { id: 19, url: 'https://picsum.photos/600/860?random=19', title: 'Bali Beach Resorts', category: 'Indonesia Travel' },
  { id: 20, url: 'https://picsum.photos/600/940?random=20', title: 'New York City Guide', category: 'USA Travel' },
  
  // Art & DIY
  { id: 21, url: 'https://picsum.photos/600/740?random=21', title: 'Watercolor Painting Tips', category: 'Art Tutorials' },
  { id: 22, url: 'https://picsum.photos/600/980?random=22', title: 'DIY Home Decor', category: 'Craft Ideas' },
  { id: 23, url: 'https://picsum.photos/600/820?random=23', title: 'Calligraphy Practice', category: 'Hand Lettering' },
  { id: 24, url: 'https://picsum.photos/600/760?random=24', title: 'Pottery Making', category: 'Ceramics' },
  { id: 25, url: 'https://picsum.photos/600/920?random=25', title: 'Macrame Wall Hanging', category: 'Fiber Arts' },
  
  // Beauty & Wellness
  { id: 26, url: 'https://picsum.photos/600/1000?random=26', title: 'Natural Skincare Routine', category: 'Beauty Tips' },
  { id: 27, url: 'https://picsum.photos/600/660?random=27', title: 'Hair Care Tips', category: 'Hair Styling' },
  { id: 28, url: 'https://picsum.photos/600/940?random=28', title: 'Makeup Tutorial', category: 'Beauty Tutorials' },
  { id: 29, url: 'https://picsum.photos/600/880?random=29', title: 'Yoga Poses', category: 'Fitness' },
  { id: 30, url: 'https://picsum.photos/600/780?random=30', title: 'Meditation Guide', category: 'Wellness' },
  
  // Technology & Gadgets
  { id: 31, url: 'https://picsum.photos/600/840?random=31', title: 'iPhone Photography Tips', category: 'Mobile Photography' },
  { id: 32, url: 'https://picsum.photos/600/960?random=32', title: 'Home Office Setup', category: 'Work From Home' },
  { id: 33, url: 'https://picsum.photos/600/800?random=33', title: 'Gaming Room Ideas', category: 'Gaming Setup' },
  { id: 34, url: 'https://picsum.photos/600/900?random=34', title: 'Smart Home Devices', category: 'Home Automation' },
  { id: 35, url: 'https://picsum.photos/600/760?random=35', title: 'Laptop Accessories', category: 'Tech Accessories' },
  
  // Nature & Outdoor
  { id: 36, url: 'https://picsum.photos/600/1040?random=36', title: 'Mountain Hiking Trail', category: 'Hiking' },
  { id: 37, url: 'https://picsum.photos/600/720?random=37', title: 'Garden Design Ideas', category: 'Gardening' },
  { id: 38, url: 'https://picsum.photos/600/860?random=38', title: 'Camping Essentials', category: 'Camping' },
  { id: 39, url: 'https://picsum.photos/600/940?random=39', title: 'Beach Photography', category: 'Photography' },
  { id: 40, url: 'https://picsum.photos/600/800?random=40', title: 'Wildlife Watching', category: 'Nature' },
  
  // Wedding & Events
  { id: 41, url: 'https://picsum.photos/600/700?random=41', title: 'Wedding Bouquet Ideas', category: 'Wedding Flowers' },
  { id: 42, url: 'https://picsum.photos/600/980?random=42', title: 'Bridal Makeup Look', category: 'Wedding Beauty' },
  { id: 43, url: 'https://picsum.photos/600/820?random=43', title: 'Wedding Venue Ideas', category: 'Wedding Planning' },
  { id: 44, url: 'https://picsum.photos/600/920?random=44', title: 'Party Decorations', category: 'Event Planning' },
  { id: 45, url: 'https://picsum.photos/600/840?random=45', title: 'Birthday Party Ideas', category: 'Party Planning' },
  
  // Kids & Family
  { id: 46, url: 'https://picsum.photos/600/880?random=46', title: 'Kids Room Decor', category: 'Children\'s Rooms' },
  { id: 47, url: 'https://picsum.photos/600/760?random=47', title: 'Educational Activities', category: 'Kids Learning' },
  { id: 48, url: 'https://picsum.photos/600/1000?random=48', title: 'Family Photo Ideas', category: 'Family Photography' },
  { id: 49, url: 'https://picsum.photos/600/740?random=49', title: 'DIY Kids Crafts', category: 'Kids Crafts' },
  { id: 50, url: 'https://picsum.photos/600/900?random=50', title: 'Healthy Kids Snacks', category: 'Kids Food' },
]

export function ImageGrid() {
  const [selectedImage, setSelectedImage] = useState<{id: string | number, imageUrl?: string, url?: string, title: string, category?: string} | null>(null)
  const [showCreateBoard, setShowCreateBoard] = useState(false)
  const [comment, setComment] = useState('')
  const { boards, pins, createBoard, savePinToBoard, addComment, comments, loading } = useBoards()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your pins...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {pins.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">No pins yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">Start by uploading some images or saving pins from the sample gallery below</p>
          <div className="flex justify-center space-x-4">
            <Link href="/upload" className="bg-pinterest-red text-white px-6 py-3 rounded-full hover:bg-pinterest-red-hover transition-colors font-medium shadow-sm">
              Upload Images
            </Link>
            <Link href="/boards" className="bg-white text-gray-700 px-6 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium border border-gray-300 shadow-sm">
              Create Board
            </Link>
          </div>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6">
          {pins.map((pin) => (
            <div 
              key={pin.id} 
              className="break-inside-avoid bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedImage(pin)}
            >
              <div className="relative">
                <Image
                  src={pin.imageUrl}
                  alt={pin.title || 'Pin image'}
                  width={300}
                  height={400}
                  className="w-full h-auto rounded-t-2xl"
                  unoptimized={true}
                  onLoad={() => console.log('✅ User pin loaded successfully:', pin.imageUrl)}
                  onError={(e) => {
                    console.error('❌ User pin failed to load:', pin.imageUrl)
                    console.error('Error details:', e)
                    // Don't hide the image, show a placeholder instead
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+'
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                
                {/* Pinterest-style overlay on hover */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-white/90 hover:bg-white text-gray-700 shadow-sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button size="sm" className="bg-white/90 hover:bg-white text-gray-700 shadow-sm">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Pin content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{pin.title}</h3>
                <p className="text-xs text-gray-500">Saved by you</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sample Images Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Ideas for you</h2>
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-6 space-y-6">
          {SAMPLE_IMAGES.map((image) => (
            <div 
              key={image.id} 
              className="break-inside-avoid bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative">
                <Image
                  src={image.url}
                  alt={image.title}
                  width={300}
                  height={400}
                  className="w-full h-auto rounded-t-2xl"
                  unoptimized={true}
                  onLoad={() => console.log('✅ Image loaded successfully:', image.url)}
                  onError={(e) => {
                    console.error('❌ Image failed to load:', image.url)
                    console.error('Error details:', e)
                    // Don't hide the image, show a placeholder instead
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+'
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                
                {/* Pinterest-style overlay on hover */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-white/90 hover:bg-white text-gray-700 shadow-sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button size="sm" className="bg-white/90 hover:bg-white text-gray-700 shadow-sm">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Pinterest-style card content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{image.title}</h3>
                <p className="text-xs text-gray-500">{image.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Detail Modal */}
      {selectedImage && (
        <Modal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          className="max-w-5xl w-full mx-4"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Image */}
            <div className="flex-1">
              <Image
                src={selectedImage.imageUrl || selectedImage.url || ''}
                alt={selectedImage.title}
                width={600}
                height={800}
                className="w-full h-auto rounded-2xl"
                unoptimized={true}
                key={selectedImage.id} // Force re-render with same image
                onError={(e) => {
                  console.error('Modal image failed to load:', selectedImage.imageUrl || selectedImage.url)
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>

            {/* Details Panel */}
            <div className="w-full lg:w-96 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{selectedImage.title}</h2>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                    <Share className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Save to Board */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Save to board</h3>
                <div className="grid grid-cols-1 gap-3">
                  {boards.map((board) => (
                    <Button 
                      key={board.id} 
                      variant="outline" 
                      size="sm" 
                      className="justify-start h-12 text-left"
                      onClick={async () => {
                        await savePinToBoard(
                          selectedImage.id.toString(), 
                          board.id, 
                          selectedImage.imageUrl || selectedImage.url || '', 
                          selectedImage.title
                        )
                        alert(`Saved to ${board.name}!`)
                      }}
                    >
                      <Bookmark className="w-4 h-4 mr-3" />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{board.name}</div>
                        {board.description && (
                          <div className="text-xs text-gray-500 truncate">{board.description}</div>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
                <Button 
                  className="w-full h-12"
                  onClick={() => setShowCreateBoard(true)}
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  Create New Board
                </Button>
              </div>

              {/* Comments Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {(comments[selectedImage.id.toString()] || []).map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-pinterest-red rounded-full flex items-center justify-center text-sm text-white font-bold">
                          {comment.author.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-900">{comment.author}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            {comment.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-800">{comment.text}</p>
                    </div>
                  ))}
                  
                  {(!comments[selectedImage.id.toString()] || comments[selectedImage.id.toString()].length === 0) && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
                    </div>
                  )}
                </div>
                
                {/* Add Comment */}
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pinterest-red focus:border-pinterest-red"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && comment.trim()) {
                        addComment(selectedImage.id.toString(), comment.trim())
                        setComment('')
                      }
                    }}
                  />
                  <Button 
                    size="sm"
                    className="px-6"
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
        onCreateBoard={async (name, description) => {
          await createBoard(name, description)
          alert(`Board "${name}" created successfully!`)
        }}
      />
    </>
  )
}
