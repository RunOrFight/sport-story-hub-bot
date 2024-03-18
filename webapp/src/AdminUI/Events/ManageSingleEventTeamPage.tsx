import { Flex, Input, Table } from "antd";
import { BackButton } from "../../Components/BackButton.tsx";
import { webappRoutes } from "../../../../src/constants/webappRoutes.ts";
import { generatePath, useParams } from "react-router-dom";
import { useAppSelector } from "../../Hooks/UseAppSelector.ts";
import { eventsSlice } from "../../Store/Events/EventsSlice.ts";
import { withProps } from "../../Utils/WithProps.ts";
import { RequestStatusToComponent } from "../../Components/RequestStatusToComponent.tsx";
import { EVENTS_GET_BY_ID_REQUEST_SYMBOL } from "../../Store/Events/EventsVariables.ts";
import { useAppDispatch } from "../../Hooks/UseAppDispatch.ts";
import { ChangeEventHandler } from "react";
import { Participant } from "../../../../src/database/entities/Participant.ts";
import { TableRowSelection } from "antd/es/table/interface";
import { FixedButton } from "../../Components/FixedButton.tsx";
import { PARTICIPANT_TABLE_COLUMNS } from "./ParticipantTableColumns.tsx";

const ManageSingleEventTeamPageSuccess = () => {
  const { eventId, teamId: teamIdString } = useParams();
  const dispatch = useAppDispatch();

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    dispatch(eventsSlice.actions.searchTeamParticipant(e.target.value));
  };

  const value = useAppSelector(
    eventsSlice.selectors.teamParticipantSearchString,
  );

  const teamId = Number(teamIdString);

  const participants = useAppSelector((state) =>
    eventsSlice.selectors.potentialTeamParticipantsBySearchString(
      state,
      teamId,
    ),
  );

  const teamParticipantIds = useAppSelector(
    eventsSlice.selectors.selectedTeamParticipantIds,
  );

  const rowSelection: TableRowSelection<Participant> = {
    type: "checkbox",
    onChange: (selectedRowKeys) => {
      dispatch(
        eventsSlice.actions.selectTeamParticipantIds(
          selectedRowKeys as number[],
        ),
      );
    },
    selectedRowKeys: teamParticipantIds,
  };

  const hasSelections = teamParticipantIds.length > 0;

  const onClick = () => {
    teamParticipantIds.forEach((participantId) => {
      dispatch(
        eventsSlice.actions.addTeamParticipant({
          teamId,
          participantId,
        }),
      );
    });
    dispatch(eventsSlice.actions.selectTeamParticipantIds([]));
  };

  return (
    <Flex style={{ padding: 16 }} vertical gap={16}>
      <BackButton
        path={generatePath(webappRoutes.manageSingleEventRoute, { eventId })}
      />

      <Input
        placeholder={"Search For Event Participants"}
        onChange={onChange}
        value={value}
      />

      <Table
        columns={PARTICIPANT_TABLE_COLUMNS}
        showHeader={false}
        rowSelection={rowSelection}
        rowKey={"id"}
        dataSource={participants}
        style={{ paddingBottom: 32 }}
      />

      <FixedButton disabled={!hasSelections} onClick={onClick}>
        {hasSelections
          ? `Add ${teamParticipantIds.length} ${teamParticipantIds.length > 1 ? "Participants" : "Participant"}`
          : "Select Participants"}
      </FixedButton>
    </Flex>
  );
};

const ManageSingleEventTeamPage = withProps(RequestStatusToComponent)({
  requestSymbol: EVENTS_GET_BY_ID_REQUEST_SYMBOL,
  SUCCESS: ManageSingleEventTeamPageSuccess,
});

export { ManageSingleEventTeamPage };
