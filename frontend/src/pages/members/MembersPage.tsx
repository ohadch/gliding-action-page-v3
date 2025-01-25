import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store";
import { getMemberDisplayValue } from "../../utils/display";
import { useTranslation } from "react-i18next";
import { fetchMembers, fetchMembersRoles } from "../../store/members";
import { useEffect } from "react";
import { MemberRoleSchema } from "../../lib/types";

export default function MembersPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { members, roles } = useSelector((state: RootState) => state.members);

    useEffect(() => {
        dispatch(fetchMembers());
        dispatch(fetchMembersRoles());
    }, [dispatch]);

    const getMemberRoles = (memberId: number) => {
        return roles
            ?.filter((role: MemberRoleSchema) => role.member_id === memberId)
            .map((role: MemberRoleSchema) => t(role.role))
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