import React from 'react'
import styles from '../styles/LogoSlider.module.css'

export default function LogoSlider() {
  return (
    <section className="bg-background pb-2">
      <div className="group relative m-auto max-w-7xl px-6">
        <div className="flex flex-col items-center md:flex-row">
          <div className="md:max-w-44 md:border-r md:pr-6">
            <p className="text-end text-sm">Powering the best teams</p>
          </div>
          <div className="relative py-6 md:w-[calc(100%-11rem)]">
            <div className="overflow-hidden">
              <div className={`flex w-max ${styles.slider}`} style={{ gap: '112px' }}>
                <div className="flex">
                  <img className="mx-auto h-5 w-fit dark:invert" alt="Elevance Health Logo" height="20" width="auto" src="https://www.elevancehealth.com/content/dam/elevance-health/images/logos/elevance-health-logo.svg" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-4 w-fit dark:invert" alt="WebMD Logo" height="16" width="auto" src="https://www.webmd.com/img/webmd-logo.svg" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-4 w-fit dark:invert" alt="CVS Health Logo" height="16" width="auto" src="https://www.cvshealth.com/content/dam/cvs-health/images/logos/cvs-health-logo.svg" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-5 w-fit dark:invert" alt="Cigna Logo" height="20" width="auto" src="https://www.cigna.com/content/dam/cigna-com/images/logos/cigna-logo.svg" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-5 w-fit dark:invert" alt="Johnson & Johnson Logo" height="20" width="auto" src="https://www.jnj.com/content/dam/jnj-com/images/logos/jnj-logo.svg" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-4 w-fit dark:invert" alt="Pfizer Logo" height="16" width="auto" src="https://www.pfizer.com/content/dam/pfizer-com/images/logos/pfizer-logo.svg" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-7 w-fit dark:invert" alt="Quest Diagnostics Logo" height="28" width="auto" src="https://www.questdiagnostics.com/content/dam/quest-com/images/logos/quest-logo.svg" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-6 w-fit dark:invert" alt="Elevance Health Logo" height="24" width="auto" src="https://www.elevancehealth.com/content/dam/elevance-health/images/logos/elevance-health-logo.svg" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-5 w-fit dark:invert" alt="WebMD Logo" height="20" width="auto" src="https://www.webmd.com/img/webmd-logo.svg" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-4 w-fit dark:invert" alt="CVS Health Logo" height="16" width="auto" src="https://www.cvshealth.com/content/dam/cvs-health/images/logos/cvs-health-logo.svg" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-5 w-fit dark:invert" alt="Cigna Logo" height="20" width="auto" src="https://www.cigna.com/content/dam/cigna-com/images/logos/cigna-logo.svg" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-5 w-fit dark:invert" alt="Johnson & Johnson Logo" height="20" width="auto" src="https://www.jnj.com/content/dam/jnj-com/images/logos/jnj-logo.svg" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-4 w-fit dark:invert" alt="Pfizer Logo" height="16" width="auto" src="https://www.pfizer.com/content/dam/pfizer-com/images/logos/pfizer-logo.svg" />
                </div>
                <div className="flex">
                  <img className="mx-auto h-7 w-fit dark:invert" alt="Quest Diagnostics Logo" height="28" width="auto" src="https://www.questdiagnostics.com/content/dam/quest-com/images/logos/quest-logo.svg" />
                </div>
              </div>
            </div>
            <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
            <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
            <div className="pointer-events-none absolute left-0 top-0 h-full w-20">
              <div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ maskImage: 'linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 11.1111%, rgb(255, 255, 255) 22.2222%, rgba(255, 255, 255, 0) 33.3333%)', backdropFilter: 'blur(0px)' }}></div>
              <div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ maskImage: 'linear-gradient(270deg, rgba(255, 255, 255, 0) 11.1111%, rgb(255, 255, 255) 22.2222%, rgb(255, 255, 255) 33.3333%, rgba(255, 255, 255, 0) 44.4444%)', backdropFilter: 'blur(1px)' }}></div>
              <div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ maskImage: 'linear-gradient(270deg, rgba(255, 255, 255, 0) 22.2222%, rgb(255, 255, 255) 33.3333%, rgb(255, 255, 255) 44.4444%, rgba(255, 255, 255, 0) 55.5556%)', backdropFilter: 'blur(2px)' }}></div>
              <div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ maskImage: 'linear-gradient(270deg, rgba(255, 255, 255, 0) 33.3333%, rgb(255, 255, 255) 44.4444%, rgb(255, 255, 255) 55.5556%, rgba(255, 255, 255, 0) 66.6667%)', backdropFilter: 'blur(3px)' }}></div>
              <div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ maskImage: 'linear-gradient(270deg, rgba(255, 255, 255, 0) 44.4444%, rgb(255, 255, 255) 55.5556%, rgb(255, 255, 255) 66.6667%, rgba(255, 255, 255, 0) 77.7778%)', backdropFilter: 'blur(4px)' }}></div>
              <div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ maskImage: 'linear-gradient(270deg, rgba(255, 255, 255, 0) 55.5556%, rgb(255, 255, 255) 66.6667%, rgb(255, 255, 255) 77.7778%, rgba(255, 255, 255, 0) 88.8889%)', backdropFilter: 'blur(5px)' }}></div>
              <div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ maskImage: 'linear-gradient(270deg, rgba(255, 255, 255, 0) 66.6667%, rgb(255, 255, 255) 77.7778%, rgb(255, 255, 255) 88.8889%, rgba(255, 255, 255, 0) 100%)', backdropFilter: 'blur(6px)' }}></div>
              <div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ maskImage: 'linear-gradient(270deg, rgba(255, 255, 255, 0) 77.7778%, rgb(255, 255, 255) 88.8889%, rgb(255, 255, 255) 100%, rgba(255, 255, 255, 0) 111.111%)', backdropFilter: 'blur(7px)' }}></div>
            </div>
            <div className="pointer-events-none absolute right-0 top-0 h-full w-20">
              <div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ maskImage: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgb(255, 255, 255) 11.1111%, rgb(255, 255, 255) 22.2222%, rgba(255, 255, 255, 0) 33.3333%)', backdropFilter: 'blur(0px)' }}></div>
              <div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ maskImage: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 11.1111%, rgb(255, 255, 255) 22.2222%, rgb(255, 255, 255) 33.3333%, rgba(255, 255, 255, 0) 44.4444%)', backdropFilter: 'blur(1px)' }}></div>
              <div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ maskImage: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 22.2222%, rgb(255, 255, 255) 33.3333%, rgb(255, 255, 255) 44.4444%, rgba(255, 255, 255, 0) 55.5556%)', backdropFilter: 'blur(2px)' }}></div>
              <div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ maskImage: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 33.3333%, rgb(255, 255, 255) 44.4444%, rgb(255, 255, 255) 55.5556%, rgba(255, 255, 255, 0) 66.6667%)', backdropFilter: 'blur(3px)' }}></div>
              <div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ maskImage: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 44.4444%, rgb(255, 255, 255) 55.5556%, rgb(255, 255, 255) 66.6667%, rgba(255, 255, 255, 0) 77.7778%)', backdropFilter: 'blur(4px)' }}></div>
              <div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ maskImage: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 55.5556%, rgb(255, 255, 255) 66.6667%, rgb(255, 255, 255) 77.7778%, rgba(255, 255, 255, 0) 88.8889%)', backdropFilter: 'blur(5px)' }}></div>
              <div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ maskImage: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 66.6667%, rgb(255, 255, 255) 77.7778%, rgb(255, 255, 255) 88.8889%, rgba(255, 255, 255, 0) 100%)', backdropFilter: 'blur(6px)' }}></div>
              <div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ maskImage: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 77.7778%, rgb(255, 255, 255) 88.8889%, rgb(255, 255, 255) 100%, rgba(255, 255, 255, 0) 111.111%)', backdropFilter: 'blur(7px)' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 