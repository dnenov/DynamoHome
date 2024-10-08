import { useState, useRef, useEffect } from 'react';
import styles from './CustomDropDown.module.css';
import { OpenArrow } from '../Common/Arrow';

export const CustomDropdown = ({
    id,
    options,
    placeholder,
    onSelectionChange,
    className,
    showDivider = true,
    wholeButtonActionable = false,
    disableArrowHoverShadow = false
}: Dropdown & {
    className?: string,
    showDivider?: boolean,
    wholeButtonActionable?: boolean,
    disableArrowHoverShadow?: boolean
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [lastSelected, setLastSelected] = useState(options[0]);
    const dropdownRef = useRef(null);
    const arrowColor = isOpen ? "rgba(56,171,223,0.35)" : "#949494";

    const toggleDropdown = () => setIsOpen(!isOpen);

    /** Peforms the selected action type when used as a Drop-down */
    const handleOptionSelect = (option: option) => {
        setIsOpen(false);
        if (onSelectionChange) {
            onSelectionChange(option.value); 
        }
    };

    /** Peforms the selected action type when used as a Button */
    const handleDefaultAction = () => {
        if (onSelectionChange) {
            onSelectionChange(lastSelected.value);
        }
    };

    /** Handles navigate away from the drop-down control */
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div
            className={`
            ${styles['custom-dropdown']} 
            ${isOpen ? styles.open : ''} 
            ${disableArrowHoverShadow ? styles['no-hover-shadow'] : ''} 
            ${className}
            `}
            ref={dropdownRef}>
            <div
                className={styles['dropdown-selected']}
                onClick={wholeButtonActionable ? toggleDropdown : undefined}
            >
                <span>{placeholder}</span>
                {showDivider && <span className={styles['vertical-line']}></span>}
                <div
                    className={styles['arrow-container']}
                    onClick={wholeButtonActionable ? undefined : (e) => {
                        e.stopPropagation();
                        toggleDropdown();
                    }}
                >
                    <OpenArrow isOpen={isOpen} color={arrowColor} />
                </div>
            </div>
            <div className={`${styles['dropdown-options']} ${isOpen ? styles.open : ''}`}>
                {options.map((option, index) => (
                    <div id={`${id}-${index}`} key={index} className={styles['dropdown-option']} onClick={() => handleOptionSelect(option)}>
                        {option.label}
                    </div>
                ))}
            </div>
        </div>
    );
};