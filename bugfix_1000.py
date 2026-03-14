class Map:
    def __init__(self, location_labels):
        self.location_labels = location_labels
        self.language = 'en'
        self.labels_loaded = False

    def load_labels(self, language):
        if language not in self.location_labels:
            raise ValueError(f"Language {language} not supported.")
        self.language = language
        self.labels_loaded = True

    def get_label(self, location):
        if not self.labels_loaded:
            raise RuntimeError("Labels have not been loaded. Call load_labels() first.")
        return self.location_labels[self.language].get(location, "Unknown Location")

    def update_labels(self):
        # Simulate a scenario where the map is panned and the labels need to be reloaded
        self.labels_loaded = False
        # Simulate label loading based on current language
        self.load_labels(self.language)

# Test cases
if __name__ == "__main__":
    # Create a map with location labels for English and Spanish
    location_labels = {
        'en': {'New York': 'New York', 'Paris': 'Paris'},
        'es': {'New York': 'Nueva York', 'Paris': 'París'}
    }
    map_instance = Map(location_labels)

    # Test getting label in English
    assert map_instance.get_label('New York') == 'New York'
    # Test getting label in Spanish
    map_instance.load_labels('es')
    assert map_instance.get_label('New York') == 'Nueva York'
    # Test getting label without loading labels
    try:
        map_instance.get_label('New York')
    except RuntimeError as e:
        assert str(e) == "Labels have not been loaded. Call load_labels() first."
    # Test getting label for unsupported language
    try:
        map_instance.load_labels('fr')
    except ValueError as e:
        assert str(e) == "Language fr not supported."
    print("All tests passed.")