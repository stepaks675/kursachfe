import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

interface MovieCardProps {
  movie: {
    id: number
    title: string
    image: string
    year: number
    rating: number
    genres: string[]
  }
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.id}`} className="block group">
      <div className="relative overflow-hidden rounded-lg aspect-[2/3]">
        <Image
          src={movie.image || "/placeholder.svg"}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center space-x-1 bg-purple-600/80 px-2 py-0.5 rounded text-xs font-medium">
              <Star className="h-3 w-3 fill-current" />
              <span>{movie.rating}</span>
            </div>
            <div className="text-xs font-medium">{movie.year}</div>
          </div>

          <div className="flex flex-wrap gap-1 mb-1">
            {movie.genres.slice(0, 2).map((genre) => (
              <span key={genre} className="px-2 py-0.5 bg-gray-800/80 rounded-full text-xs font-medium">
                {genre}
              </span>
            ))}
            {movie.genres.length > 2 && (
              <span className="px-2 py-0.5 bg-gray-800/80 rounded-full text-xs font-medium">
                +{movie.genres.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>

      <h3 className="mt-2 font-medium line-clamp-1">{movie.title}</h3>
    </Link>
  )
}