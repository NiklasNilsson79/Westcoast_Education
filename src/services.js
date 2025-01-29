export const mapData = (response) => {
  const result = {
    results: response.map((data) => {
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        duration: data.duration,
        imageUrl: data.imageUrl,
      };
    }),
  };
  return result;
};
