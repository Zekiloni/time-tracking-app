import {useState, useEffect} from 'react';
import {Chips} from "primereact/chips";
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';
import {Calendar} from 'primereact/calendar';
import {InputText} from 'primereact/inputtext';
import type {RecordModel} from "../domain/record.model.ts";


interface Props {
    visible: boolean;
    onHide: () => void;
    onSave: (record: Partial<RecordModel>) => void;
}

export default function CreateRecordDialog({visible, onHide, onSave}: Props) {
    const [project, setProject] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (startTime && endTime) {
            const diff = (endTime.getTime() - startTime.getTime()) / 1000 / 60; // in minutes
            setDuration(diff > 0 ? Math.round(diff) : 0);
        }
    }, [startTime, endTime]);

    const handleSave = () => {
        if (!project || !startTime || !endTime) return alert("Fill all required fields");

        onSave({
            project: project,
            tags,
            description,
            startTime,
            endTime,
            duration,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        setTags([])
        setProject('');
        setDescription('');
        setStartTime(null);
        setEndTime(null);
        setDuration(0);
        onHide();
    };

    return (
        <Dialog
            header="New Time Entry"
            visible={visible}
            onHide={onHide}
            style={{width: '45%'}}
            modal
        >
            <div className="flex flex-column gap-4">
                <span className="p-float-label">
                    <InputText id="project" value={project} onChange={(e) => setProject(e.target.value)}/>
                    <label htmlFor="project">Project</label>
                </span>


                <span className="p-float-label">
                    <InputText id="description" value={description} onChange={(e) => setDescription(e.target.value)}/>
                    <label htmlFor="description">Description</label>
                </span>

                <span className="p-float-label">
                    <Chips id="tags" value={tags} onChange={(e) => setTags(e.value)}/>
                    <label htmlFor="tags">Tags</label>
                </span>

                <span className="p-float-label">
                    <Calendar
                        id="startTime"
                        value={startTime}
                        onChange={(e) => setStartTime(e.value as Date)}
                        showTime
                        hourFormat="12"
                    />
                    <label htmlFor="startTime">Start Time</label>
                </span>

                <span className="p-float-label">
                    <Calendar
                        id="endTime"
                        value={endTime}
                        onChange={(e) => setEndTime(e.value as Date)}
                        showTime
                        hourFormat="12"
                    />
                    <label htmlFor="endTime">End Time</label>
                </span>

                <div className="text-sm text-gray-500">
                    Duration: <strong>{Math.floor(duration / 60)}h {duration % 60}m</strong>
                </div>

                <Button label="Save Entry" icon="pi pi-check" onClick={handleSave}/>
            </div>
        </Dialog>
    );
}
