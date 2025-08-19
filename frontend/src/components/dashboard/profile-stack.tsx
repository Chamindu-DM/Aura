'use client'

interface ProfileStackProps {
  profiles: Array<{
    name: string
    image?: string
  }>
  additionalCount?: number
}

export function ProfileStack({ profiles, additionalCount }: ProfileStackProps) {
  return (
    <div className="flex gap-3 items-center">
      <div className="flex pl-0 pr-1.5 py-0 relative isolate">
        {profiles.map((profile, index) => (
          <div 
            key={index} 
            className={`w-8 h-8 rounded-[10px] border-2 border-[#fcfcfc] overflow-hidden relative ${
              index > 0 ? '-ml-1.5' : ''
            }`}
            style={{ zIndex: profiles.length - index }}
          >
            {profile.image ? (
              <img 
                src={profile.image} 
                alt={profile.name}
                className="w-full h-full object-cover rounded-[10px]"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 rounded-[10px] flex items-center justify-center text-xs font-medium">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="font-['Inter_Tight'] text-[15px] text-[rgba(33,33,33,0.62)] tracking-[0.45px] leading-[22px] flex gap-1">
        <span>
          {profiles.map(p => p.name.split(' ')[0]).join(', ')}
        </span>
        {additionalCount && (
          <span>
            +{additionalCount} others
          </span>
        )}
      </div>
    </div>
  )
}
