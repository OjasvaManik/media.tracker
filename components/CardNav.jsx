'use client'

import {useLayoutEffect, useRef, useState} from 'react';
import {gsap} from 'gsap';
import {GoArrowUpRight} from 'react-icons/go';
import './CardNav.css';
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {MediaSearchDialog} from "@/components/media-search-dialog";
import {ThemeToggle} from "@/components/theme-toggle";

const CardNav = ({
                     logo,
                     logoAlt = 'Logo',
                     items,
                     className = '',
                     ease = 'power3.out',
                     baseColor = '#fff',
                     menuColor,
                     buttonBgColor,
                     buttonTextColor
                 }) => {
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const [searchOpen, setSearchOpen] = useState(false);
    const [searchType, setSearchType] = useState('all');

    const navRef = useRef(null);
    const cardsRef = useRef([]);
    const tlRef = useRef(null);

    const calculateHeight = () => {
        const navEl = navRef.current;
        if (!navEl) return 260;

        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (isMobile) {
            const contentEl = navEl.querySelector('.card-nav-content');
            if (contentEl) {
                const wasVisible = contentEl.style.visibility;
                const wasPointerEvents = contentEl.style.pointerEvents;
                const wasPosition = contentEl.style.position;
                const wasHeight = contentEl.style.height;

                contentEl.style.visibility = 'visible';
                contentEl.style.pointerEvents = 'auto';
                contentEl.style.position = 'static';
                contentEl.style.height = 'auto';

                contentEl.offsetHeight;

                const topBar = 60;
                const padding = 16;
                const contentHeight = contentEl.scrollHeight;

                contentEl.style.visibility = wasVisible;
                contentEl.style.pointerEvents = wasPointerEvents;
                contentEl.style.position = wasPosition;
                contentEl.style.height = wasHeight;

                return topBar + contentHeight + padding;
            }
        }
        return 260;
    };

    const createTimeline = () => {
        const navEl = navRef.current;
        if (!navEl) return null;

        gsap.set(navEl, {height: 60, overflow: 'hidden'});
        gsap.set(cardsRef.current, {y: 50, opacity: 0});

        const tl = gsap.timeline({paused: true});

        tl.to(navEl, {
            height: calculateHeight,
            duration: 0.4,
            ease
        });

        tl.to(cardsRef.current, {y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08}, '-=0.1');

        return tl;
    };

    useLayoutEffect(() => {
        const tl = createTimeline();
        tlRef.current = tl;

        return () => {
            tl?.kill();
            tlRef.current = null;
        };
    }, [ease, items]);

    useLayoutEffect(() => {
        const handleResize = () => {
            if (!tlRef.current) return;

            if (isExpanded) {
                const newHeight = calculateHeight();
                gsap.set(navRef.current, {height: newHeight});

                tlRef.current.kill();
                const newTl = createTimeline();
                if (newTl) {
                    newTl.progress(1);
                    tlRef.current = newTl;
                }
            } else {
                tlRef.current.kill();
                const newTl = createTimeline();
                if (newTl) {
                    tlRef.current = newTl;
                }
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isExpanded]);

    const toggleMenu = () => {
        const tl = tlRef.current;
        if (!tl) return;
        if (!isExpanded) {
            setIsHamburgerOpen(true);
            setIsExpanded(true);
            tl.play(0);
        } else {
            setIsHamburgerOpen(false);
            tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
            tl.reverse();
        }
    };

    const closeMenu = (onComplete) => {
        if (!isExpanded) {
            if (typeof onComplete === 'function') onComplete();
            return;
        }
        const tl = tlRef.current;
        if (!tl) {
            if (typeof onComplete === 'function') onComplete();
            return;
        }

        setIsHamburgerOpen(false);
        tl.eventCallback('onReverseComplete', () => {
            setIsExpanded(false);
            if (typeof onComplete === 'function') onComplete();
        });
        tl.reverse();
    };

    const setCardRef = i => el => {
        if (el) cardsRef.current[i] = el;
    };

    const openSearch = (type) => {
        setSearchType(type.toLowerCase());
        closeMenu(() => {
            setSearchOpen(true);
        });
    }

    return (
        <div className={`card-nav-container ${className}`}>
            <nav ref={navRef} className={`card-nav ${isExpanded ? 'open' : ''}`} style={{backgroundColor: baseColor}}>
                <div className="card-nav-top">
                    <div
                        className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
                        onClick={toggleMenu}
                        role="button"
                        aria-label={isExpanded ? 'Close menu' : 'Open menu'}
                        tabIndex={0}
                        style={{color: menuColor || '#000'}}
                    >
                        <div className="hamburger-line"/>
                        <div className="hamburger-line"/>
                    </div>

                    <div className="logo-container">
                        <Link href={'/'} onClick={closeMenu}>
                            <img src={logo} alt={logoAlt} className="logo"/>
                        </Link>
                    </div>

                    <div className="flex items-center justify-end gap-4 h-full">
                        <ThemeToggle/>

                        <Button
                            type="button"
                            className="card-nav-cta-button uppercase h-10"
                            style={{backgroundColor: buttonBgColor, color: buttonTextColor}}
                            asChild
                        >
                            <Link href={'/add'} onClick={closeMenu}>
                                Add Title
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="card-nav-content" aria-hidden={!isExpanded}>
                    {(items || []).slice(0, 3).map((item, idx) => (
                        <div
                            key={`${item.label}-${idx}`}
                            className="nav-card relative overflow-hidden"
                            ref={setCardRef(idx)}
                            style={{
                                backgroundColor: item.bgColor || '#000',
                                color: item.textColor || '#fff',
                                backgroundImage: item.bgImage ? `url(${item.bgImage})` : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            {item.bgImage && (
                                <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none"/>
                            )}

                            <div className="nav-card-label relative z-10">{item.label}</div>
                            <div className="nav-card-links relative z-10">
                                {item.links?.map((lnk, i) => {
                                    if (lnk.href.includes('search')) {
                                        return (
                                            <button
                                                key={`${lnk.label}-${i}`}
                                                className="nav-card-link text-left w-full flex items-center bg-transparent border-none p-0 cursor-pointer text-inherit font-[inherit]"
                                                onClick={() => openSearch(item.label)}
                                                aria-label={lnk.ariaLabel}
                                            >
                                                <GoArrowUpRight className="nav-card-link-icon" aria-hidden="true"/>
                                                {lnk.label}
                                            </button>
                                        )
                                    }

                                    return (
                                        <Link
                                            key={`${lnk.label}-${i}`}
                                            className="nav-card-link"
                                            href={lnk.href}
                                            onClick={closeMenu}
                                            aria-label={lnk.ariaLabel}
                                        >
                                            <GoArrowUpRight className="nav-card-link-icon" aria-hidden="true"/>
                                            {lnk.label}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </nav>

            <MediaSearchDialog
                open={searchOpen}
                setOpen={setSearchOpen}
                defaultType={searchType}
            />
        </div>
    );
};

export default CardNav;