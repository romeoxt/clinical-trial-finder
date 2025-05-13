import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'Trial ID is required' });
  }

  try {
    // Fetch detailed trial information from ClinicalTrials.gov API v2
    const url = `https://clinicaltrials.gov/api/v2/studies/${id}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ message: 'Trial not found' });
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.protocolSection) {
      throw new Error('Invalid trial data received');
    }

    const protocol = data.protocolSection;
    const identification = protocol.identificationModule;
    const status = protocol.statusModule;
    const description = protocol.descriptionModule;
    const conditions = protocol.conditionsModule;
    const design = protocol.designModule;
    const locations = protocol.contactsLocationsModule?.locations || [];
    const contacts = protocol.contactsLocationsModule?.centralContacts || [];

    // Format the response data
    const trial = {
      NCTId: identification.nctId,
      BriefTitle: identification.briefTitle,
      OverallStatus: status.overallStatus,
      StartDate: status.startDateStruct?.date,
      CompletionDate: status.completionDateStruct?.date,
      BriefSummary: description.briefSummary,
      Condition: conditions.conditions?.[0],
      StudyType: design.studyType,
      Phase: design.phases?.[0],
      EnrollmentCount: design.enrollmentInfo?.count,
      LocationFacility: locations[0]?.facility,
      EligibilityCriteria: {
        inclusion: protocol.eligibilityModule?.eligibilityCriteria?.split('\n')
          .filter(line => line.toLowerCase().includes('inclusion'))
          .map(line => line.replace(/^inclusion criteria:/i, '').trim()),
        exclusion: protocol.eligibilityModule?.eligibilityCriteria?.split('\n')
          .filter(line => line.toLowerCase().includes('exclusion'))
          .map(line => line.replace(/^exclusion criteria:/i, '').trim())
      },
      Locations: locations
        .filter(location => location.facility)
        .map(location => ({
          facility: location.facility,
          address: location.address || 'Not specified',
          city: location.city || 'Not specified',
          state: location.state || 'Not specified',
          zip: location.zip || 'Not specified'
        })),
      ContactInfo: {
        primary: {
          name: contacts[0]?.name || 'Not specified',
          email: contacts[0]?.email || 'Not specified',
          phone: contacts[0]?.phone || 'Not specified'
        },
        backup: {
          name: contacts[1]?.name || 'Not specified',
          email: contacts[1]?.email || 'Not specified',
          phone: contacts[1]?.phone || 'Not specified'
        }
      }
    };

    res.status(200).json(trial);
  } catch (error) {
    console.error('Error fetching trial details:', error);
    res.status(500).json({ 
      message: 'Error fetching trial details',
      error: error.message 
    });
  }
} 