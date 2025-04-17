import React, { useEffect, useState } from "react"
import "./RollingCounter.css"

interface RollingCounterProps {
	endValue: number
	duration?: number
	className?: string
	delay?: number
	digitHeight?: number
	fontSize?: number
	commas?: boolean
	highlightColor?: string
}

export const RollingCounter: React.FC<RollingCounterProps> = ({
	endValue,
	duration = 2000,
	className = "",
	delay = 0,
	digitHeight = 40,
	fontSize = 24,
	commas = true,
	highlightColor = "text-primary"
}) => {
	const [isVisible, setIsVisible] = useState(false)
	const [isComplete, setIsComplete] = useState(false)

	// Format the number with commas if needed
	const formattedValue = commas
		? new Intl.NumberFormat("en-US").format(endValue)
		: endValue.toString()

	// Split into digits and commas
	const characters = formattedValue.split("")

	useEffect(() => {
		const visibilityTimer = setTimeout(() => {
			setIsVisible(true)
		}, delay)

		const completionTimer = setTimeout(
			() => {
				setIsComplete(true)
			},
			delay + duration + 200
		)

		return () => {
			clearTimeout(visibilityTimer)
			clearTimeout(completionTimer)
		}
	}, [delay, duration, endValue])

	return (
		<div className={`flex items-center ${className} ${isComplete ? "counter-complete" : ""}`}>
			{characters.map((char, idx) => {
				// Check if the character is a comma
				const isComma = char === ","

				if (isComma) {
					return (
						<div
							key={`comma-${idx}`}
							className={`comma ${isVisible ? "visible" : ""}`}
							style={{
								height: `${digitHeight}px`,
								marginLeft: "1px",
								marginRight: "1px",
								fontSize: `${fontSize}px`
							}}
						>
							,
						</div>
					)
				}

				return (
					<div
						key={idx}
						className="digit-column"
						style={{
							height: `${digitHeight}px`,
							width: `${digitHeight * 0.4}px`
						}}
					>
						<div
							className="digit-roller"
							style={{
								transform: isVisible
									? `translateY(-${parseInt(char) * digitHeight}px)`
									: "translateY(0)",
								transitionDelay: `${delay + idx * 70}ms`
							}}
						>
							{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
								<div
									key={num}
									className="digit-item"
									style={{
										height: `${digitHeight}px`,
										width: `${digitHeight * 0.4}px`,
										fontSize: `${fontSize}px`
									}}
								>
									{num}
								</div>
							))}
						</div>
					</div>
				)
			})}
		</div>
	)
}
