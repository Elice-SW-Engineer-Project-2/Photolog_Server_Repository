export const union = (first: string[], second: string[]): string[] => {
  const union = [...first];
  second.forEach((value) => {
    if (!union.includes(value)) union.push(value);
  });

  return union;
};

export const intersect = (first: string[], second: string[]): string[] => {
  return first.filter((value) => second.includes(value)); // 둘 다 있으면 교집합
};

export const complement = (first: string[], second: string[]): string[] => {
  return first.filter((value) => !second.includes(value)); // 중복되는 것 제거하면 차집합
};
