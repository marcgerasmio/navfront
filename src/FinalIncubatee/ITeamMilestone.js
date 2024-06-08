import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Form, Container, Card, ProgressBar, FloatingLabel } from "react-bootstrap";
import { TbEdit } from "react-icons/tb";
import { IoMdAddCircle } from "react-icons/io";
import INavbar from './INavbar.js';

function ITeamMilestone() {
  const [milestones, setMilestones] = useState([]);
  const [topics, setTopics] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [milestonePercentages, setMilestonePercentages] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [submissionLink, setSubmissionLink] = useState("");
  const [selectedTeam, setSelectedTeam] = useState('15');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [selectedSubmissionLinkId, setSelectedSubmissionLinkId] = useState(null);
  const [teamid, setTeamId] = useState('');
  const team_ceo = sessionStorage.getItem('name');

  const fetchTeamId = async () => {
    try {
      const response = await fetch(`http://navigatu.test/api/find/${team_ceo}`);
      const data = await response.json();
      console.log(data);
      const team_id = data[0].team_id;
      setTeamId(team_id);
      fetchSubmissions(team_id);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchMilestones = async () => {
    try {
      const response = await fetch(`http://navigatu.test/api/viewmilestone`);
      const data = await response.json();
      setMilestones(data);
    } catch (error) {
      console.error('Error fetching milestones:', error);
    }
  };

  const fetchTopics = async () => {
    try {
      const response = await fetch(`http://navigatu.test/api/viewtopic`);
      const data = await response.json();
      setTopics(data);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const fetchSubmissions = async (team_id) => {
    try {
      const response = await fetch(`http://navigatu.test/api/displaysubmission/${team_id}`);
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  useEffect(() => {
    fetchMilestones();
    fetchTopics();
    fetchTeamId();
  }, []);

  useEffect(() => {
    const computeMilestonePercentages = () => {
      const percentages = {};
      milestones.forEach(milestone => {
        const milestoneTopics = topics.filter(topic => topic.milestone_id === milestone.milestone_id);
        const approvedSubmissions = submissions.filter(submission =>
          milestoneTopics.some(topic => topic.topic_id === submission.topic_id) && submission.status === 'approved'
        );
        const percentage = approvedSubmissions.length / milestoneTopics.length * 100 || 0;
        percentages[milestone.milestone_id] = percentage;
      });
      setMilestonePercentages(percentages);
    };
    computeMilestonePercentages();
  }, [milestones, topics, submissions]);

  const handleMilestoneChange = (event) => {
    setSelectedMilestone(event.target.value);
    setSelectedTopic("");
  };

  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
  };

  const handleSubmissionLinkChange = (event) => {
    setSubmissionLink(event.target.value);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedMilestone(null);
    setSelectedTopic(null);
    setSubmissionLink("");
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setSelectedMilestone(null);
    setSelectedTopic(null);
    setSubmissionLink("");
  };

  const handleSubmission = async () => {
    const isSubmissionExists = submissions.some(
      (submission) => submission.team_id === parseInt(selectedTeam) && submission.topic_id === parseInt(selectedTopic)
    );

    if (isSubmissionExists) {
      alert("Submission already exists.");
      return;
    }

    try {
      const response = await fetch('http://navigatu.test/api/createsubmission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          milestone_id: selectedMilestone,
          topic_id: selectedTopic,
          submission_link: submissionLink,
          team_id: teamid,
          status: 'to be reviewed',
          comment: 'to be reviewed',
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit');
      }
      alert('Submission successful');
      handleModalClose();
      fetchTeamId();
    } catch (error) {
      alert("Submission failed. Please try again.");
      console.error('Error submitting:', error.message);
    }
  };

  const handleSubmissionEdit = async (milestoneId, topicId, submissionLinkId) => {
    setShowEditModal(true);
    setSelectedMilestoneId(milestoneId);
    setSelectedTopicId(topicId);
    setSelectedSubmissionLinkId(submissionLinkId);
    const submission = submissions.find(submission => submission.submission_id === submissionLinkId);
    if (submission) {
      setSubmissionLink(submission.submission_link);
    }
  };

  const handleEditSubmission = async () => {
    try {
      const response = await fetch(`http://navigatu.test/api/updatesubmission/${selectedSubmissionLinkId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          milestone_id: selectedMilestoneId,
          topic_id: selectedTopicId,
          submission_link: submissionLink,
          team_id: selectedTeam,
          status: 'to be reviewed',
          comment: 'to be reviewed',
        }),
      });
      alert('Edit Submission successful');
      handleEditModalClose();
      fetchSubmissions();
    } catch (error) {
      alert("Submission failed. Please try again.");
      console.error('Error submitting:', error.message);
    }
  };

  

  return (
    <>
      <INavbar />
      <Container>
        <div className="d-flex justify-content-between align-items-center mt-4">
          <h3 className='title-text text-center mt-2'>Team Milestone Overall Completion: %</h3>
          <Button variant="primary" onClick={() => setShowModal(true)} className="login-button p-2 fw-bold">
            <IoMdAddCircle size={25} className="mb-1" />&nbsp;
            Add Submission
          </Button>
        </div>
        {milestones.map((milestone) => (
          <Card className="mb-5 submissions mt-5" key={milestone.milestone_id}>
            <Card.Header>
              <h5 className="title-text fw-bold">Milestone {milestone.milestone_id} - {milestone.milestone_name}</h5>
              <p>Completion Percentage: {milestonePercentages[milestone.milestone_id] || 0}%</p>
              <ProgressBar
                animated now={milestonePercentages[milestone.milestone_id] || 0}
                labelPlacement="top"
                className="w-25"
              />
            </Card.Header>
            <Card.Body>
              <div key={milestone.milestone_id}>
                <Table bordered hover style={{ tableLayout: 'fixed' }}>
                  <thead>
                    <tr>
                      <th className="title-text">Subtopics</th>
                      <th className="title-text">Submission Link</th>
                      <th className="title-text">Status</th>
                      <th className="title-text">Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topics
                      .filter(topic => topic.milestone_id === milestone.milestone_id)
                      .map(topic => (
                        <tr key={topic.topic_id}>
                          <td>{topic.topic_name}</td>
                          <td style={{ wordWrap: 'break-word' }}>
                            {submissions
                              .filter(submission => submission.topic_id === topic.topic_id)
                              .map(submission => (
                                <div key={submission.submission_id}>
                                  <a href={submission.submission_link}>
                                    {submission.submission_link}
                                  </a>
                                  <span
                                    style={{ marginLeft: '5px', cursor: 'pointer' }}
                                    onClick={() => handleSubmissionEdit(milestone.milestone_id, topic.topic_id, submission.submission_id)}>
                                    <TbEdit />
                                  </span>
                                </div>
                              ))}
                          </td>
                          <td>
                            {submissions
                              .filter(submission => submission.topic_id === topic.topic_id)
                              .map(submission => (
                                <div key={submission.submission_id}>
                                  {submission.status}
                                </div>
                              ))}
                          </td>
                          <td>
                            {submissions
                              .filter(submission => submission.topic_id === topic.topic_id)
                              .map(submission => (
                                <div key={submission.submission_id}>
                                  {submission && (
                                    <p>
                                      {submission.comment}
                                    </p>
                                  )}
                                </div>
                              ))}
                          </td>
                        </tr>
                      ))}
                    {topics.filter(topic => topic.milestone_id === milestone.milestone_id).length === 0 && (
                      <tr key={`empty-${milestone.milestone_id}`}>
                        <td>{milestone.milestone_name}</td>
                        <td>No Submission</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        ))}
      </Container>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold title-text">Add Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FloatingLabel controlId="milestoneDropdown" label="Select Milestone" className="mb-3">
              <Form.Select onChange={handleMilestoneChange}>
                <option value="">Select Milestone</option>
                {milestones.map((milestone) => (
                  <option key={milestone.milestone_id} value={milestone.milestone_id}>
                    {milestone.milestone_name}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
            <FloatingLabel controlId="topicDropdown" label="Select Topic" className="mb-3">
              <Form.Select onChange={handleTopicChange} value={selectedTopic}>
                <option value="">Select Topic</option>
                {selectedMilestone &&
                  topics
                    .filter((topic) => topic.milestone_id === parseInt(selectedMilestone))
                    .map((topic) => (
                      <option key={topic.topic_id} value={topic.topic_id}>
                        {topic.topic_name}
                      </option>
                    ))}
              </Form.Select>
            </FloatingLabel>
            <Form.Group controlId="submissionLinkInput" className="mb-3">
              <FloatingLabel controlId="submissionLinkInput" label="Submission Link">
                <Form.Control type="text" value={submissionLink} onChange={handleSubmissionLinkChange} />
              </FloatingLabel>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button variant="outline-secondary" onClick={handleModalClose} className="fw-bold p-3 w-25">Close</Button>
          <Button variant="primary" onClick={handleSubmission} className="fw-bold p-3 w-25 login-button">Submit</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="submissionLinkInput">
            <Form.Label>Submission Link</Form.Label>
            <Form.Control type="text" value={submissionLink} onChange={handleSubmissionLinkChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleEditSubmission}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ITeamMilestone;
