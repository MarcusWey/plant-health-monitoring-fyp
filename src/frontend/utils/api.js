export async function beginFarmizSession(userId) {
  const response = await fetch("http://127.0.0.1:8000/chatbot/begin-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!response.ok) {
    throw new Error("Failed to begin Farmiz session");
  }
}

export async function sendMessageToFarmiz(userId, message) {
  const response = await fetch("http://127.0.0.1:8000/chatbot/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      question: message,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to communicate with Farmiz chatbot");
  }

  const data = await response.json();
  return data.answer;
}

export async function uploadImageToFarmiz(userId, file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const url = `http://127.0.0.1:8000/chatbot/upload-image?user_id=${userId}`;

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return {
      plant_condition: data.plant_condition || "No plant detected.",
      annotated_image_base64: data.annotated_image_base64 || null
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      plant_condition: "Sorry, something went wrong with image upload.",
      annotated_image_base64: null
    };
  }
}
