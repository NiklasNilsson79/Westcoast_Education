export const mapData = (response) => {
  const result = {
    // Vi tar inte med page och totalPages här eftersom vi kanske inte använder dem för details-sidan
    results: response.map((data) => {
      return {
        id: data.id, // Mappas till kursens ID
        title: data.title, // Mappas till kursens titel
        description: data.description, // Mappas till kursens beskrivning
        duration: data.duration, // Mappas till kursens varaktighet
        imageUrl: data.imageUrl, // Mappas till kursens bild-URL
      };
    }),
  };
  return result;
};
