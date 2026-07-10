import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
    createVoiceDraft,
    confirmVoiceTransaction
} from "../services/voice";

function Voice() {

    const [listening, setListening] = useState(false);

    const [spokenText, setSpokenText] = useState("");
    const [customerId, setCustomerId] = useState("");

const [draft, setDraft] = useState(null);

    const startListening = () => {

        if (!customerId.trim()) {

    alert("Please enter Customer ID first.");

    return;

}
        if (!("webkitSpeechRecognition" in window)) {

            alert("Speech Recognition is not supported in this browser.");

            return;

        }

        const recognition = new window.webkitSpeechRecognition();

        recognition.continuous = false;

        recognition.interimResults = false;

        recognition.lang = "en-IN";

        setListening(true);

        recognition.start();

        recognition.onresult = async (event) => {

    const transcript = event.results[0][0].transcript;

    setSpokenText(transcript);

    try {

        const response = await createVoiceDraft({

            customerId,

            spokenText: transcript

        });

        setDraft(response.draft);

    }

    catch (error) {

        alert(

            error.response?.data?.message ||

            "Could not create draft."

        );

    }

};

        recognition.onend = () => {

            setListening(false);

        };

       recognition.onerror = (event) => {

    setListening(false);

    console.log("Speech Error:", event.error);

    alert("Speech Error: " + event.error);

};

    };
    const handleConfirm = async () => {

    try {

        const response =
            await confirmVoiceTransaction({

                customerId: draft.customerId,

                items: draft.items,

                paymentMode: draft.paymentMode,

                spokenText

            });

        alert(response.message);

        setDraft(null);

        setSpokenText("");

        setCustomerId("");

    }

    catch (error) {

        alert(

            error.response?.data?.message ||

            "Confirmation Failed"

        );

    }

};

    return (

        <MainLayout>

            <h1 className="text-3xl font-bold mb-6">

                Voice AI

            </h1>

            <div className="bg-white shadow rounded-lg p-8">
                <div className="mb-6">

<input

type="text"

placeholder="Customer ID (CUST0001)"

className="border w-full p-3 rounded"

value={customerId}

onChange={(e)=>setCustomerId(e.target.value)}

/>

</div>
                <button

                    onClick={startListening}

                    className={`px-8 py-4 rounded text-white text-xl ${
                        listening
                            ? "bg-red-600"
                            : "bg-blue-600"
                    }`}

                >

                    {listening ? "Listening..." : "🎤 Start Recording"}

                </button>

                <div className="mt-8">

                    <h2 className="text-xl font-bold mb-3">

                        Spoken Text

                    </h2>

                    <textarea

                        rows="5"

                        className="w-full border rounded p-4"

                        value={spokenText}

                        readOnly

                    />
                    {
draft && (

<div className="bg-green-50 border mt-6 p-5 rounded">

<h2 className="text-xl font-bold mb-4">

Draft Preview

</h2>

<p>

Customer :

<b>{draft.customerId}</b>

</p>

<p>

Payment :

<b>{draft.paymentMode}</b>

</p>

<table className="w-full mt-4">

<thead>

<tr>

<th>Item</th>

<th>Qty</th>

<th>Unit</th>

</tr>

</thead>

<tbody>

{

draft.items.map((item,index)=>(

<tr key={index}>

<td>{item.itemName}</td>

<td>{item.quantity}</td>

<td>{item.unit}</td>

</tr>

))

}

</tbody>

</table>

{

draft.needsClarification && (

<p className="text-red-600 mt-4">

{draft.clarificationMessage}

</p>

)

}

<button

onClick={handleConfirm}

className="bg-green-600 text-white px-6 py-2 rounded mt-5"

>

Confirm Transaction

</button>

</div>

)
}

                </div>

            </div>

        </MainLayout>

    );

}

export default Voice;