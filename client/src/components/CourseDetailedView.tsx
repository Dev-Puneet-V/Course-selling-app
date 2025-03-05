import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ContentForm from "./ContentForm";
import Modal from "./Modal";

const CourseDetailedView: React.FC = () => {
     const { id } = useParams();
    const [data, setData] = useState<any>({})
    const [isFormVisible, setFormVisibility] = useState(false);

    const fetchCourse = async () => {
        const response = await axios.get(`http://localhost:3000/api/v1/course/${id}`, {
            withCredentials: true, 
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = response.data;
        const status = response.status;
        if (status === 200) {
            setData(data?.data)
        }

    }
    useEffect(() => {
        fetchCourse();
    }, []);
    
    const handleButtonClick = async () => {
        setFormVisibility((prev: boolean) => !prev)
    }

    return <div className="flex relative h-[90vh] w-full">
        <div>
            <div></div>
            <div></div>
        </div>
        <div></div>
        <button className="absolute bottom-4 right-8 cursor-pointer p-4 border rounded-full" onClick={handleButtonClick}>Add content + </button>
        <Modal isOpen={isFormVisible}>
            <ContentForm handleCloseButton={handleButtonClick} id={id + ""} />
        </Modal>
    </div>;
};

export default CourseDetailedView;
