// superadminData.js

export const ac = (i) => {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#FFD93D",
    "#6C5CE7",
    "#00B894",
    "#FDCB6E",
    "#0984E3",
    "#E17055"
  ];

  return colors[i % colors.length];
};