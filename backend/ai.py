import onnxruntime as rt
import numpy as np
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "viking_comfort_model.onnx")

class VikingAI:
    def __init__(self):
        self.session = rt.InferenceSession(MODEL_PATH, providers=['CPUExecutionProvider'])
        self.input_name = self.session.get_inputs()[0].name
        self.label_name = self.session.get_outputs()[0].name

    def predict_comfort(self, age, sex, height, weight, temp, humidity, density, pressure) -> int:
        """
        Receives raw data from the bus sensors/user profile and returns 1-8.
        """
        input_data = np.array([[
            float(age), 
            float(sex), 
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