import datetime
from unittest.mock import MagicMock

from src.crud.action import ActionCrud
from src.models import Action


class TestActionCrud:
    def test_get_or_create_action_by_date_existing(self, mocker):
        # Given
        db = MagicMock()
        action_crud = ActionCrud()
        mock_date = datetime.date(2022, 1, 1)
        mock_action = MagicMock()

        # Mock query to return an existing action
        db.query(action_crud.model).filter.return_value.first.return_value = mock_action

        # When
        result = action_crud.get_or_create_action_by_date(db=db, date=mock_date)

        # Then
        db.add.assert_not_called()
        db.commit.assert_not_called()
        db.refresh.assert_not_called()
        assert result == mock_action

    def test_get_or_create_action_by_date_new(self, mocker):
        # Given
        db = MagicMock()
        action_crud = ActionCrud()
        mock_date = datetime.date(2022, 1, 1)

        # Mock query to return no existing action
        db.query(action_crud.model).filter.return_value.first.return_value = None

        def mock_add_action(action):
            assert isinstance(action, Action)
            action.id = 1  # Simulate database assigning an ID
            db.refresh.return_value = action

        db.add.side_effect = mock_add_action

        # When
        result = action_crud.get_or_create_action_by_date(db=db, date=mock_date)

        # Then
        db.add.assert_called_once()
        db.commit.assert_called_once()
        db.refresh.assert_called_once_with(result)
        assert result.date == datetime.datetime(
            mock_date.year, mock_date.month, mock_date.day
        )
