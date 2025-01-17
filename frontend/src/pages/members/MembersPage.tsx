import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store";
import { getMemberDisplayValue } from "../../utils/display";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import {fetchMembers, fetchMembersRoles} from "../../store/actions/member.ts";

export default function MembersPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { members, membersRoles } = useSelector((state: RootState) => state.members);

    useEffect(() => {
        dispatch(fetchMembers());
        dispatch(fetchMembersRoles());
    }, [dispatch]);

    const getMemberRoles = (memberId: number) => {
        return membersRoles
            ?.filter(role => role.member_id === memberId)
            .map(role => t(role.role))
            .join(", ");
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                {t("MEMBERS")}
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t("NAME")}</TableCell>
                            <TableCell>{t("EMAIL")}</TableCell>
                            <TableCell>{t("PHONE")}</TableCell>
                            <TableCell>{t("ROLES")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {members?.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell>{getMemberDisplayValue(member)}</TableCell>
                                <TableCell>{member.email}</TableCell>
                                <TableCell>{member.phone_number}</TableCell>
                                <TableCell>{getMemberRoles(member.id)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
} 