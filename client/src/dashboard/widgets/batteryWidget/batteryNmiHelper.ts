const BACKEND_ID_DELIMITER = "_";

export const getNmiFromFeatureId = (featureId: string): string => {
  const [id, nmi] = featureId.split(BACKEND_ID_DELIMITER);

  if (id && nmi) {
    return nmi;
  }

  throw new Error(`Failed to get the nmi from the featureId: ${featureId}`);
};
