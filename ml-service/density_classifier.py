"""
Traffic Density Classifier using Decision Tree.
Classifies traffic as Low, Medium, or High based on vehicle counts.
Also suggests adaptive green signal timing.
"""

import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split


class DensityClassifier:
    def __init__(self):
        """Initialize and train the Decision Tree classifier."""
        self.model = DecisionTreeClassifier(random_state=42)
        self._train()

    def _train(self):
        """Train classifier with synthetic traffic data."""
        # Features: [cars, bikes, buses, trucks, total]
        # Labels: 0=Low, 1=Medium, 2=High
        np.random.seed(42)

        X = []
        y = []

        # Low density: 0-10 total vehicles
        for _ in range(200):
            cars = np.random.randint(0, 5)
            bikes = np.random.randint(0, 4)
            buses = np.random.randint(0, 2)
            trucks = np.random.randint(0, 2)
            total = cars + bikes + buses + trucks
            if total <= 10:
                X.append([cars, bikes, buses, trucks, total])
                y.append(0)

        # Medium density: 11-25 total vehicles
        for _ in range(200):
            cars = np.random.randint(3, 12)
            bikes = np.random.randint(2, 8)
            buses = np.random.randint(0, 4)
            trucks = np.random.randint(0, 4)
            total = cars + bikes + buses + trucks
            if 11 <= total <= 25:
                X.append([cars, bikes, buses, trucks, total])
                y.append(1)

        # High density: 26+ total vehicles
        for _ in range(200):
            cars = np.random.randint(8, 25)
            bikes = np.random.randint(5, 15)
            buses = np.random.randint(1, 6)
            trucks = np.random.randint(1, 6)
            total = cars + bikes + buses + trucks
            if total >= 26:
                X.append([cars, bikes, buses, trucks, total])
                y.append(2)

        X = np.array(X)
        y = np.array(y)

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        self.model.fit(X_train, y_train)

        accuracy = self.model.score(X_test, y_test)
        print(f"Density classifier trained. Accuracy: {accuracy:.2f}")

    def classify(self, cars, bikes, buses, trucks):
        """Classify traffic density based on vehicle counts."""
        total = cars + bikes + buses + trucks
        features = np.array([[cars, bikes, buses, trucks, total]])
        prediction = self.model.predict(features)[0]

        labels = {0: "Low", 1: "Medium", 2: "High"}
        return labels[prediction]

    def suggest_green_time(self, density):
        """Suggest adaptive green signal timing based on density."""
        timing = {
            "Low": 20,
            "Medium": 40,
            "High": 60,
        }
        return timing.get(density, 30)
