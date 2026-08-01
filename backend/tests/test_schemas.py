import schemas


def test_ai_schemas_exist_and_can_be_instantiated():
    summary = schemas.AISummary(
        current_focus="Investigating a high-risk alert",
        risk_score=80,
        risk_label="High",
        recommended_actions=["Review the alert"],
        related_alert_id=42,
    )
    assert summary.risk_score == 80

    request = schemas.AIAskRequest(question="What is happening?")
    assert request.question == "What is happening?"

    response = schemas.AIAskResponse(answer="The system is healthy")
    assert response.answer == "The system is healthy"
