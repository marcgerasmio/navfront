import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { TbEdit } from "react-icons/tb";

function TeamMilestone () {
  const [milestones, setMilestones] = useState([]);
  const [topics, setTopics] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [milestonePercentages, setMilestonePercentages] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [submissionLink, setSubmissionLink] = useState("");
  const [selectedTeam, setSelectedTeam] = useState('15');
  const [showEditModal, setShowEditModal] = useState(false); // State for showing edit modal
  const [selectedMilestoneId, setSelectedMilestoneId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [selectedSubmissionLinkId, setSelectedSubmissionLinkId] = useState(null);
  const [comment, setComment] = useState(null);
  const teamid = sessionStorage.getItem("team_id");
  const [status, setStatus] = useState(null);

  
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
        const response = await fetch(`http://navigatu.test/api/displaysubmission/${teamid}`);
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

    
    const handleSubmissionEdit = async (milestoneId, topicId, submissionLinkId, submissionLink) => {
        setSelectedMilestoneId(milestoneId);
        setSelectedTopicId(topicId);
        setSelectedSubmissionLinkId(submissionLinkId);
        setSubmissionLink(submissionLink); // Set the submissionLink state
      console.log(submissionLinkId);
        ViewSubmission(milestoneId, topicId, submissionLink, submissionLinkId);
      };
      
      const ViewSubmission = async (milestoneId, topicId, submissionLink, submissionLinkId) => {
        try {
          const response = await fetch(`http://navigatu.test/api/updatesubmission/${submissionLinkId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                milestone_id: milestoneId,
                topic_id: topicId, 
                submission_link: submissionLink,
                team_id: selectedTeam, 
                status: 'on-going',
                comment: 'on-going',
            }),
          });
          fetchSubmissions();
        } catch (error) {
          // Handle errors
          alert("Submission failed. Please try again.");
          console.error('Error submitting:', error.message);
        }
      };
      
      const handleSubmissionUpdate = async (milestoneId, topicId, submissionLinkId, submissionLink) => {
        // Find the submission being edited
        const submission = submissions.find(submission => submission.submission_id === submissionLinkId);
        if (submission) {
          // Set status and comment from the submission being edited
          setStatus(submission.status);
          setComment(submission.comment);
        }
      
        // Set other states
        setSelectedMilestoneId(milestoneId);
        setSelectedTopicId(topicId);
        setSelectedSubmissionLinkId(submissionLinkId);
        setSubmissionLink(submissionLink);
        setShowEditModal(true); // Show edit modal when this function is called
      }
      

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
              status: status,
              comment: comment,
            }),
          });
          alert('Edit Submission successful');
          // Close the modal after successful submission
          setShowEditModal(false); // Hide the modal after submission
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
                    <tr key={topic.topic_id} >
                      <td>{topic.topic_name}</td>
                      <td style={{ wordWrap: 'break-word' }}>
                      {submissions
    .filter(submission => submission.topic_id === topic.topic_id)
    .map(submission => (
      <div key={submission.submission_id}>
        <a href={submission.submission_link} target="_blank"
        onClick={() => handleSubmissionEdit(milestone.milestone_id, topic.topic_id, submission.submission_id,submission.submission_link)}>
          {submission.submission_link}
          
        </a>
      </div>

    ))}
    {submissions.filter(submission => submission.topic_id === topic.topic_id).length === 0 && (
    <div>No Submission</div>
  )}
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
            <span   style={{ marginLeft: '5px', cursor: 'pointer' }}
         onClick={() => handleSubmissionUpdate(milestone.milestone_id, topic.topic_id, submission.submission_id, submission.submission_link)}><TbEdit /></span>
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
                    <td></td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        ))}
  
        {/* Edit modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Edit Comment</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form.Group controlId="submissionLinkInput">
      <Form.Label>Submission Link</Form.Label>
      <Form.Control type="text" value={submissionLink} onChange={(e) => setSubmissionLink(e.target.value)} disabled/>
    </Form.Group>
    <Form.Group controlId="statusSelect">
      <Form.Label>Status</Form.Label>
      <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="on-going">On-Going</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </Form.Control>
    </Form.Group>
    <Form.Group controlId="commentInput">
      <Form.Label>Comment</Form.Label>
      <Form.Control as="textarea" value={comment} onChange={(e) => setComment(e.target.value)} />
    </Form.Group>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
    <Button variant="primary" onClick={handleEditSubmission}>Save Changes</Button>
  </Modal.Footer>
</Modal>
  
      </div>
  
  
  
      
    );
  }
  


export default TeamMilestone;