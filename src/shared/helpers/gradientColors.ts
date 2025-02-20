const gradientColors = ["#dc2626", "#d97706", "#059669"];

const gradientColors2 = ["#57ABFF", "#0062C9", "#004A97", "#00356D", "#002246"];

export function getColorFromGradient(
  percentage: number,
  reversed = false,
  gradientBlue = false,
  max = 100
): string {
  if (!percentage) {
    return "#222732";
  }

  const colors = gradientBlue ? gradientColors2 : gradientColors;
  if (reversed) {
    percentage = max - percentage;
  }
  const clampedPercentage = Math.max(0, Math.min(max, percentage));

  const index = Math.round((clampedPercentage / max) * (colors.length - 1));

  return colors[index];
}
