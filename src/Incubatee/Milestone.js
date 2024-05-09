import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { TbEdit } from "react-icons/tb";

function IncubateeMilestone() {
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

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`http://navigatu.test/api/displaysubmission/15`);
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  useEffect(() => {
    fetchMilestones();
    fetchTopics();
    fetchSubmissions();
  }, []);

  useEffect(() => {
    const computeMilestonePercentages = () => {
      const percentages = {};
      milestones.forEach(milestone => {
        const milestoneTopics = topics.filter(topic => topic.milestone_id === milestone.milestone_id);
        const milestoneSubmissions = submissions.filter(submission =>
          milestoneTopics.some(topic => topic.topic_id === submission.topic_id)
        );
        const percentage = milestoneSubmissions.length / milestoneTopics.length * 100 || 0;
        percentages[milestone.milestone_id] = percentage;
      });
      setMilestonePercentages(percentages);
    };

    computeMilestonePercentages();
  }, [milestones, topics, submissions]);

  const handleMilestoneChange = (event) => {
    setSelectedMilestone(event.target.value);
    setSelectedTopic(""); // Reset selected topic when a new milestone is selected
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
    // Check if submission with the same team_id and topic_id already exists in the table data
    const isSubmissionExists = submissions.some(
      (submission) => submission.team_id === parseInt(selectedTeam) && submission.topic_id === parseInt(selectedTopic)
    );
  
    if (isSubmissionExists) {
      // If submission already exists, show error message
     alert("Submission already exists.");
      return;
    }
  
    try {
      // Proceed with submission
      const response = await fetch('http://navigatu.test/api/createsubmission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          milestone_id: selectedMilestone,
          topic_id: selectedTopic,
          submission_link: submissionLink,
          team_id: selectedTeam, 
          status: 'to be reviewed',
          comment:'to be reviewed',
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit');
      }
      // Handle success
      alert('Submission successful');
      // Close the modal after successful submission
      handleModalClose();
      // Refetch submissions to update the list
      fetchSubmissions();
    } catch (error) {
      // Handle errors
      alert("Submission failed. Please try again.");
      console.error('Error submitting:', error.message);
    }
  };
  
  const handleSubmissionEdit = async (milestoneId, topicId, submissionLinkId) => {
    // Open the modal for editing
    setShowEditModal(true);
    // Set the selected milestoneId, topicId, and submissionLinkId
    setSelectedMilestoneId(milestoneId);
    setSelectedTopicId(topicId);
    setSelectedSubmissionLinkId(submissionLinkId);
  
    // Find the submission with the given submissionLinkId
    const submission = submissions.find(submission => submission.submission_id === submissionLinkId);
    if (submission) {
      // Populate the submission link in the state
      setSubmissionLink(submission.submission_link);
    }
  };

  const handleEditSubmission = async () =>{
    try {
      // Proceed with submission
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
          comment:'to be reviewed',
        }),
      });
      alert('Edit Submission successful');
      // Close the modal after successful submission
      handleEditModalClose();
      // Refetch submissions to update the list
      fetchSubmissions();
    } catch (error) {
      // Handle errors
      alert("Submission failed. Please try again.");
      console.error('Error submitting:', error.message);
    }
  }
  

  return (
    <div>
       <Button variant="primary" onClick={() => setShowModal(true)}>
            Add Submission
          </Button>
      {milestones.map((milestone) => (
        <div key={milestone.milestone_id}>
          <h2>Milestone {milestone.milestone_id} - {milestone.milestone_name}</h2>
          <p>Completion Percentage: {milestonePercentages[milestone.milestone_id] || 0}%</p>
          <Table bordered hover style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th>Subtopics</th>
                <th>Submission Link</th>
                <th>Status</th>
                <th>Comments</th>
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
      <span   style={{ marginLeft: '5px', cursor: 'pointer' }}
         onClick={() => handleSubmissionEdit(milestone.milestone_id, topic.topic_id, submission.submission_id)}><TbEdit /></span>
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
              {/* If no topics found for this milestone, render an empty row */}
              {topics.filter(topic => topic.milestone_id === milestone.milestone_id).length === 0 && (
                <tr key={`empty-${milestone.milestone_id}`}>
                  <td>{milestone.milestone_name}</td>
                  <td>No Submission</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      ))}

     {/* Submission Modal */}
     <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="milestoneDropdown">
              <Form.Label>Select Milestone</Form.Label>
              <Form.Control as="select" onChange={handleMilestoneChange}>
                <option value="">Select Milestone</option>
                {milestones.map((milestone) => (
                  <option key={milestone.milestone_id} value={milestone.milestone_id}>
                    {milestone.milestone_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="topicDropdown">
  <Form.Label>Select Topic</Form.Label>
  <Form.Control as="select" onChange={handleTopicChange} value={selectedTopic}>
    <option value="">Select Topic</option>
    {selectedMilestone &&
      topics
        .filter((topic) => topic.milestone_id === parseInt(selectedMilestone))
        .map((topic) => (
          <option key={topic.topic_id} value={topic.topic_id}>
            {topic.topic_name}
          </option>
        ))}
  </Form.Control>
</Form.Group>

            <Form.Group controlId="submissionLinkInput">
              <Form.Label>Submission Link</Form.Label>
              <Form.Control type="text" value={submissionLink} onChange={handleSubmissionLinkChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmission}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>



      {/* {edit modal} */}
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
    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
      Close
    </Button>
    <Button variant="primary"onClick={handleEditSubmission}>
      Save Changes
    </Button>
  </Modal.Footer>
</Modal>

    </div>



    
  );
}

export default IncubateeMilestone;