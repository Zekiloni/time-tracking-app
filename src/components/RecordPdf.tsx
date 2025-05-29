import {Document, Page, Text, View, StyleSheet} from "@react-pdf/renderer";
import {format} from "date-fns";
import type {RecordModel} from "../domain/record.model.ts";

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    header: {fontSize: 16, marginBottom: 10, textAlign: "center"},
    tableRow: {flexDirection: "row"},
    tableColHeader: {
        width: "14%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#bfbfbf",
        backgroundColor: "#eee",
        padding: 3,
    },
    table: {display: "none", width: "100%", marginBottom: 10},
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    },
    tableCellHeader: {fontWeight: "bold"},
    tableCol: {
        width: "14%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#bfbfbf",
        padding: 3,
    },
});


interface PdfDocumentProps {
    records: RecordModel[];
}

export default function RecordPdf({ records = [] }: PdfDocumentProps) {
    return (
        <Document>
            <Page style={styles.page}>
                {/* header + table layout */}
                {records.map((r, i) => (
                    <View key={i} style={styles.tableRow}>
                        <Text style={styles.tableCol}>{format(new Date(r.createdAt), "yyyy-MM-dd")}</Text>
                        <Text style={styles.tableCol}>{r.project || "-"}</Text>
                        <Text style={styles.tableCol}>{r.tags?.join(", ") || "-"}</Text>
                        <Text style={styles.tableCol}>{r.description || "-"}</Text>
                        <Text style={styles.tableCol}>{format(new Date(r.startTime), "HH:mm")}</Text>
                        <Text style={styles.tableCol}>{format(new Date(r.endTime), "HH:mm")}</Text>
                        <Text style={styles.tableCol}>
                            {r.duration ? `${Math.floor(r.duration / 60)}h ${r.duration % 60}m` : "-"}
                        </Text>
                    </View>
                ))}
            </Page>
        </Document>
    );
}