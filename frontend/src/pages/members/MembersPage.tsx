import { useEffect, useState } from 'react'
import { IMember, IMemberCreate } from "../../@types";
import { membersApiService } from "../../services/api";
import { Button, Grid } from '@mui/material';
import CreateMemberDialog from '../../components/members/CreateMemberDialog';
import MembersTable from "../../components/members/MembersTable.tsx";
import EditMemberDialog from "../../components/members/EditMemberDialog.tsx";

export default function MembersPage() {
    const [members, setMembers] = useState<IMember[]>([]);
    const [createMemberDialogOpen, setCreateMemberDialogOpen] = useState<boolean>(false);
    const [currentlyEditedMember, setCurrentlyEditedMember] = useState<IMember | null>(null);

    useEffect(() => {
        membersApiService.get().then((members) => {
            setMembers(members);
        });
    }, []);

    const addMember = (data: IMemberCreate) => {
        membersApiService
            .create(data)
            .then((member) => {
                setMembers([...members, member]);
            })
            .catch((err) => {
                alert(err);
            })
    }

    const editMember = (member: IMember) => {
        membersApiService
            .update(member.id, {
                name: member.name,
                status: member.status,
            })
            .then((member) => {
                setMembers(members.map((m) => m.id === member.id ? member : m));
                setCurrentlyEditedMember(null);
            })
            .catch((err) => {
                alert(err);
            })
    }

    const deleteMember = (member: IMember) => {
        if (!window.confirm(`Are you sure you want to delete ${member.name}?`)) {
            return;
        }

        membersApiService
            .delete(member.id)
            .then(() => {
                setMembers(members.filter((m) => m.id !== member.id));
            })
            .catch((err) => {
                alert(err);
            })
    }

    return (
        <>
            <CreateMemberDialog
                open={createMemberDialogOpen}
                onClose={() => setCreateMemberDialogOpen(false)}
                onMemberCreate={addMember}
            />
            {currentlyEditedMember && (
                <EditMemberDialog
                    open={Boolean(currentlyEditedMember)}
                    onClose={() => setCurrentlyEditedMember(null)}
                    member={currentlyEditedMember}
                    onMemberUpdate={editMember}
                />
            )}
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setCreateMemberDialogOpen(true)}
                            >
                                New Member
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <MembersTable
                        members={members}
                        onEditMember={setCurrentlyEditedMember}
                        onDeleteMember={deleteMember}
                    />
                </Grid>
            </Grid>
        </>
    )
}
