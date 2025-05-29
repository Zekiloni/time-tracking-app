import {useEffect, useState} from "react";
import {signOut} from "firebase/auth";
import {auth} from "../core/firebase.ts";
import {useAuthStore} from "../core/user-store.ts";
import {createRecord, deleteRecord, getRecordById, getRecords} from "../domain/record.service.ts";
import {Button} from "primereact/button";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Card} from "primereact/card";
import {format} from "date-fns";
import type {RecordModel} from "../domain/record.model.ts";
import CreateRecordDialog from "../components/CreateRecordDialog.tsx";
import {Chip} from "primereact/chip";
import {pdf} from "@react-pdf/renderer";
import {saveAs} from "file-saver";
import RecordPdf from "../components/RecordPdf.tsx";

export default function Main() {
    const user = useAuthStore((state) => state.user);
    const [records, setRecords] = useState<RecordModel[]>([]);
    const [totals, setTotals] = useState({
        today: "0h 0m",
        week: "0h 0m",
        month: "0h 0m",
    });

    const [showDialog, setShowDialog] = useState(false);

    const handleCreate = async (record: Partial<RecordModel>) => {
        if (user) {
            record.userId = user.uid;
            const docRef = await createRecord(record as RecordModel);

            const createdRecord = await getRecordById(user.uid, docRef.id);

            if (!createdRecord) {
                console.error("Failed to retrieve created record");
                return;
            }

            setRecords((prev) => [...prev, createdRecord]);
            calculateTotals([...records, createdRecord]);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed:", error);
            alert("Failed to logout");
        }
    };

    const handleDelete = async (recordId: string) => {
        if (!user?.uid) return;

        try {
            await deleteRecord(recordId, user.uid);
            setRecords((prev) => prev.filter((r) => r.id !== recordId));
            calculateTotals(records.filter((r) => r.id !== recordId));
        } catch (err) {
            console.error("Failed to delete record", err);
            alert("Failed to delete record");
        }
    }

    const calculateTotals = (records: RecordModel[]) => {
        const now = new Date();
        let todayTotal = 0;
        let weekTotal = 0;
        let monthTotal = 0;

        for (const r of records) {
            const date = new Date(r.createdAt);
            const durationMinutes = r.duration || 0;

            if (date.toDateString() === now.toDateString()) todayTotal += durationMinutes;

            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            if (date >= startOfWeek) weekTotal += durationMinutes;

            if (date.getMonth() === now.getMonth()) monthTotal += durationMinutes;
        }

        const fmt = (m: number) => `${Math.floor(m / 60)}h ${m % 60}m`;
        setTotals({
            today: fmt(todayTotal),
            week: fmt(weekTotal),
            month: fmt(monthTotal),
        });
    };

    const exportRecords = async () => {
        const doc = <RecordPdf records={records} />;
        const blob = await pdf(doc).toBlob();
        saveAs(blob, 'records.pdf');
    }

    useEffect(() => {
        const loadRecords = async () => {
            if (!user?.uid) return;

            try {
                const userRecords = await getRecords(user.uid);
                console.log(userRecords)
                setRecords(userRecords);
                calculateTotals(userRecords);
            } catch (err) {
                console.error("Failed to load records", err);
            }
        };

        loadRecords();
    }, [user?.uid]);

    const actionTemplate = (rowData) => (
        <div className="flex gap-2 justify-center">
            <Button icon="pi pi-pencil" rounded text/>
            <Button
                icon="pi pi-trash"
                severity="danger"
                rounded
                text
                onClick={() => handleDelete(rowData.id!)}
            />
        </div>
    );

    return (
        <div className="p-6 max-w-screen-xl mx-auto">
            <div className="flex justify-content-between align-items-center mb-6">
                <h2 className="text-3xl font-semibold">Time Entries</h2>

                <div className="flex justify-content-between align-items-center gap-3">
                    <Button label="Export" severity="secondary" icon="pi pi-file-export" onClick={() => exportRecords()}/>
                    <Button label="New Entry" icon="pi pi-plus" onClick={() => setShowDialog(true)}/>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <Card>
                    <div className="text-sm text-gray-500 mb-1">Today’s Total</div>
                    <div className="text-2xl font-bold">{totals.today}</div>
                </Card>
                <Card>
                    <div className="text-sm text-gray-500 mb-1">This Week</div>
                    <div className="text-2xl font-bold">{totals.week}</div>
                </Card>
                <Card>
                    <div className="text-sm text-gray-500 mb-1">This Month</div>
                    <div className="text-2xl font-bold">{totals.month}</div>
                </Card>
            </div>

            <DataTable value={records} className="shadow-md rounded-md" scrollable scrollHeight="400px">
                <Column
                    field="createdAt"
                    header="Date"
                    body={(r) => format(new Date(r.createdAt), "yyyy-MM-dd")}
                />
                <Column
                    field="project"
                    header="Project"
                    body={(r) => r.project}
                />
                <Column
                    field="tags"
                    header="Tags"
                    body={(r) => (
                        r.tags && r.tags.length > 0
                            ? r.tags.map((tag, i) => <Chip key={i} label={tag} style={{marginRight: 4}}/>)
                            : "-"
                    )}
                />
                <Column
                    field="description"
                    header="Description"
                    body={(r) => r.description || "-"}
                />
                <Column
                    field="startTime"
                    header="Start Time"
                    body={(r) => format(new Date(r.startTime), "HH:mm")}
                />
                <Column
                    field="endTime"
                    header="End Time"
                    body={(r) => format(new Date(r.endTime), "HH:mm")}
                />
                <Column
                    field="duration"
                    header="Duration"
                    body={(r) => `${Math.floor(r.duration / 60)}h ${r.duration % 60}m`}
                />
                <Column
                    header="Actions"
                    body={actionTemplate}
                />
            </DataTable>

            <div className="flex justify-end mt-6">
                <Button
                    label="Logout"
                    severity="danger"
                    onClick={handleLogout}
                    icon="pi pi-sign-out"
                />
            </div>

            <CreateRecordDialog
                visible={showDialog}
                onHide={() => setShowDialog(false)}
                onSave={handleCreate}
            />
        </div>
    );
}
