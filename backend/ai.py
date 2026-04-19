import onnxruntime as rt
import numpy as np
import os

MODEL_PATH = "ai_engine/viking_comfort_model.onnx"

class VikingAI:
    def __init__(self):
        self.session = rt.InferenceSession(MODEL_PATH, providers=['CPUExecutionProvider'])
        self.input_name = self.session.get_inputs()[0].name
        self.label_name = self.session.get_outputs()[0].name

    def predict_comfort(self, age, gender, height, weight, temp, humidity, density, pressure) -> int:
        """
        Receives raw data from the bus sensors/user profile and returns 1-8.
        """
        input_data = np.array([[
            float(age), 
            float(gender), 
            float(height), 
            float(weight), 
            float(temp), 
            float(humidity), 
            float(density), 
            float(pressure)
        ]], dtype=np.float32)

        prediction = self.session.run([self.label_name], {self.input_name: input_data})[0]
        
        return int(prediction[0])

viking_predictor = VikingAI()

def compute_comfort(bus, user) -> int:
    """
    Translates Database Objects into AI-ready inputs.
    """
    try:
        score = viking_predictor.predict_comfort(
            age=user.age,
            gender=user.gender,
            height=user.height,
            weight=user.weight,
            temp=bus.temperature,
            humidity=bus.humidity,
            density=bus.density,
            pressure=bus.pressure
        )
        return score
    except Exception as e:
        print(f"AI Logic Error: {e}")
        return 4