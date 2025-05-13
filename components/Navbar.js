import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Home, Stethoscope, Microscope, Syringe, ClipboardList, AlertTriangle, Info, Menu, X, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Tools', href: '/tools', icon: Stethoscope },
    { name: 'Clinical Trials', href: '/trials', icon: ClipboardList },
    { name: 'Recommendations', href: '/recommendations', icon: Sparkles },
    { name: 'Vaccines', href: '/vaccines', icon: Syringe },
    { name: 'Outbreaks', href: '/outbreaks', icon: AlertTriangle },
    { name: 'About', href: '/about', icon: Info },
  ]

  const toolNavigation = [
    { name: 'Genetics Mapper', href: '/tools/genetics', icon: Microscope },
    { name: 'Medical Quiz', href: '/tools/quiz', icon: Stethoscope },
    { name: 'Diagnostics', href: '/tools/diagnostics', icon: Stethoscope },
  ]

  const isActive = (path) => router.pathname === path

  return (
    <nav className="bg-background border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-xl font-bold">
                Clinical Trial Finder
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      isActive(item.href)
                        ? 'border-b-2 border-primary text-foreground'
                        : 'border-b-2 border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground'
                    }`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 pb-3 pt-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                    isActive(item.href)
                      ? 'border-primary bg-primary/10 text-foreground'
                      : 'border-transparent text-muted-foreground hover:border-gray-300 hover:bg-accent hover:text-foreground'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Icon className="mr-2 h-5 w-5" />
                    {item.name}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Tools submenu - only show when on a tools page */}
      {router.pathname.startsWith('/tools') && (
        <div className="hidden sm:block border-t">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-12 items-center space-x-8">
              {toolNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      isActive(item.href)
                        ? 'border-b-2 border-primary text-foreground'
                        : 'border-b-2 border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground'
                    }`}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
} 