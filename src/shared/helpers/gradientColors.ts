const gradientColors = [
    "#dc2626",
    "#d97706",
    "#059669",
];

const gradientColors2 = [
    "#57ABFF",
    "#0062C9",
    "#004A97",
    "#00356D",
    "#002246"
];

export function getColorFromGradient(percentage: number, reversed = false, gradientBlue = false): string {
    if(!percentage){
        return '#222732'
    }
    
    const colors = gradientBlue ? gradientColors2 : gradientColors;
    if (reversed) {
        percentage = 100 - percentage;
    }
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    const index = Math.round((clampedPercentage / 100) * (colors.length - 1));

    return colors[index];
}
