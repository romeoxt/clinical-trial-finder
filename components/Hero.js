'use client'
import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { InfiniteSlider } from './ui/infinite-slider'
import { ProgressiveBlur } from './ui/progressive-blur'
import { cn } from '../lib/utils'
import { Menu, X, ChevronRight } from 'lucide-react'
import { useScroll, motion } from 'framer-motion'

const menuItems = [
  { name: 'Clinical Trials', href: '/trials' },
  { name: 'Recommendations', href: '/recommendations' },
  { name: 'Vaccines', href: '/vaccines' },
  { name: 'Outbreaks', href: '/outbreaks' },
  { name: 'Tools', href: '/tools' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'About', href: '/about' },
]

export default function Hero() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-x-hidden">
        <section>
          <div className="py-24 md:pb-32 lg:pb-36 lg:pt-72">
            <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 lg:block lg:px-12">
              <div className="mx-auto max-w-lg text-center lg:ml-0 lg:max-w-full lg:text-left">
                <h1 className="mt-8 max-w-2xl text-balance text-5xl md:text-6xl lg:mt-16 xl:text-7xl font-bold">
                  Find Clinical Trials
                </h1>
                <p className="mt-8 max-w-2xl text-balance text-lg">
                  Search and discover clinical trials that match your needs.
                </p>

                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                  <Button
                    asChild
                    size="lg"
                    href="/trials"
                    className="h-12 rounded-full pl-5 pr-3 text-base"
                  >
                    <div className="flex items-center">
                      <span className="text-nowrap">Start Searching</span>
                      <ChevronRight className="ml-1 h-5 w-5" />
                    </div>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    href="/about"
                    variant="ghost"
                    className="h-12 rounded-full px-5 text-base hover:bg-zinc-950/5 dark:hover:bg-white/5"
                  >
                    <div>
                      <span className="text-nowrap">Learn More</span>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
            <div className="aspect-[2/3] absolute inset-1 overflow-hidden border border-black/10 sm:aspect-video dark:border-white/5">
              <video
                autoPlay
                loop
                muted
                className="size-full object-cover opacity-50 invert dark:opacity-35 dark:invert-0 dark:lg:opacity-75"
              >
                <source src="/videos/medical-animation.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const { scrollYProgress } = useScroll()

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrolled(latest > 0.05)
    })
    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <header>
      <nav
        data-state={menuState && 'active'}
        className="group fixed z-20 w-full pt-2"
      >
        <div className={cn(
          'mx-auto max-w-7xl rounded-3xl px-6 transition-all duration-300 lg:px-12',
          scrolled && 'bg-background/50 backdrop-blur-2xl'
        )}>
          <motion.div
            className={cn(
              'relative flex flex-wrap items-center justify-between gap-6 py-3 duration-200 lg:gap-0 lg:py-6',
              scrolled && 'lg:py-4'
            )}
          >
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-600">CTF</span>
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className={cn(
                  'h-6 w-6 transition-all duration-200',
                  menuState ? 'rotate-180 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                )} />
                <X className={cn(
                  'absolute inset-0 m-auto h-6 w-6 -rotate-180 scale-0 opacity-0 transition-all duration-200',
                  menuState && 'rotate-0 scale-100 opacity-100'
                )} />
              </button>

              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={cn(
              'bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent',
              menuState && 'block lg:flex'
            )}>
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </nav>
    </header>
  )
} 