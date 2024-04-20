interface wineData {
  Alcohol: number;
  "Malic Acid": number | string;
  Ash: number | string;
  "Alcalinity of ash": number | string;
  Magnesium: number | string;
  "Total phenols": number | string;
  Flavanoids: number | string;
  "Nonflavanoid phenols": number | string;
  Proanthocyanins: number | string;
  "Color intensity": number | string;
  Hue: number | string;
  "OD280/OD315 of diluted wines": number | string;
  Unknown: number | string;
  Gamma?: number;
}

export interface ClassStats {
  mean: number;
  median: number;
  mode: number[];
}

const calculateMean = (values: (number | string)[]) => {
  let sum = 0;
  values.forEach((single) => {
    const modifiedSingle = Number(single);
    sum += modifiedSingle;
  });

  return Number((sum / values.length).toFixed(3));
};

const calculateMedian = (values: (number | string)[]): number => {
  //convert all values to numbers
  const numericValues = values.map((value) =>
    typeof value === "string" ? parseFloat(value) : value
  );

  // sort the numeric values
  numericValues.sort((a, b) => a - b);

  //calculate the median
  const middleIndex = Math.floor(numericValues.length / 2);

  if (numericValues.length % 2 === 0) {
    //even length: average the two middle values
    return Number(
      (
        (numericValues[middleIndex - 1] + numericValues[middleIndex]) /
        2
      ).toFixed(3)
    );
  } else {
    // Odd length: return the middle value
    return Number(numericValues[middleIndex].toFixed(3));
  }
};

const calculateMode = (values: (number | string)[]) => {
  // Convert all values to numbers
  const numericValues = values.map((value) =>
    typeof value === "string" ? parseFloat(value) : value
  );
  const freq: Record<number, number> = {};
  let maxFreq = 0;
  let mode: number[] = [];

  numericValues.forEach((single) => {
    freq[single] = (freq[single] || 0) + 1;
    //if frequency of current element is more than maxFreq, then update it
    if (freq[single] > maxFreq) {
      maxFreq = freq[single];
      mode = [single];
    }
    //if frequency is same as maxFreq, add it to the mode array
    else if (freq[single] === maxFreq) {
      mode.push(single);
    }
  });

  //If all elements are equally frequent, return empty array
  if (mode.length === values.length) {
    return [];
  }

  return mode;
};

const calculateByClass = (data: wineData[], gamma: boolean = false) => {
  //create a map to hold data for each class
  const parameterByClass: Record<number, (number | string)[]> = {};

  // Iterate through the data and group flavanoids by class
  data.forEach((item) => {
    const alcoholClass: number = item.Alcohol;
    //the parameter you want stats for
    const parameterForStat: number | string = gamma
      ? (item.Gamma as number)
      : item.Flavanoids;

    // Initialize the array for the class if it doesn't exist
    if (!parameterByClass[alcoholClass]) {
      parameterByClass[alcoholClass] = [];
    }

    //add flavanoids to the array for the current class
    parameterByClass[alcoholClass].push(parameterForStat);
  });

  //calculate mean, median, and mode for each class
  const statsByClass: Record<number, ClassStats> = {};

  //Calculate stats for each class
  for (const alcoholClass in parameterByClass) {
    const parameterValues: (number | string)[] = parameterByClass[alcoholClass];

    //calculate mean, median, and mode
    const mean: number = calculateMean(parameterValues);
    const median: number = calculateMedian(parameterValues);
    const mode: number[] = calculateMode(parameterValues);

    // Store the results in an object
    statsByClass[alcoholClass] = {
      mean,
      median,
      mode,
    };
  }

  //return the stats for each class
  return statsByClass;
};

const addGamma = (data: wineData[]) => {
  return data.map((point) => {
    // Calculate Gamma as (Ash * Hue) / Magnesium
    const gamma =
      (Number(point.Ash) * Number(point.Hue)) / Number(point.Magnesium);
    //Add Gamma as a new property to the data point
    point.Gamma = Number(gamma.toFixed(3));
    return point;
  });
};

export {
  calculateMean,
  calculateMedian,
  calculateMode,
  calculateByClass,
  addGamma,
};
