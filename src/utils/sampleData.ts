import { supabase } from '@/integrations/supabase/client';

export const insertSampleData = async () => {
  try {
    console.log('Inserting sample data...');

    // Insert sample departments if they don't exist
    const { data: existingDepts } = await supabase
      .from('departments')
      .select('id, name');

    if (!existingDepts || existingDepts.length === 0) {
      const { error: deptError } = await supabase
        .from('departments')
        .insert([
          { name: 'Engineering', head: 'Alex Rodriguez' },
          { name: 'Product', head: 'Emma Watson' },
          { name: 'Marketing', head: 'Sarah Chen' },
          { name: 'Sales', head: 'Robert Taylor' }
        ]);

      if (deptError) {
        console.error('Error inserting departments:', deptError);
        return;
      }
      console.log('Sample departments inserted');
    }

    // Get department IDs
    const { data: departments } = await supabase
      .from('departments')
      .select('id, name');

    if (!departments) {
      console.error('No departments found');
      return;
    }

    // Insert sample OKRs
    const sampleOKRs = [
      {
        objective: 'Increase customer satisfaction and retention rates',
        owner_id: '11111111-1111-1111-1111-111111111111', // This should match a real user ID
        department_id: departments.find(d => d.name === 'Product')?.id,
        level: 'company',
        type: 'committed',
        deadline: '2024-12-31',
        progress: 82
      },
      {
        objective: 'Launch revolutionary mobile app experience',
        owner_id: '11111111-1111-1111-1111-111111111111',
        department_id: departments.find(d => d.name === 'Engineering')?.id,
        level: 'team',
        type: 'aspirational',
        deadline: '2024-11-30',
        progress: 38
      },
      {
        objective: 'Improve team collaboration and communication',
        owner_id: '11111111-1111-1111-1111-111111111111',
        department_id: departments.find(d => d.name === 'Engineering')?.id,
        level: 'individual',
        type: 'committed',
        deadline: '2024-10-31',
        progress: 95
      },
      {
        objective: 'Expand market presence in Asia Pacific region',
        owner_id: '11111111-1111-1111-1111-111111111111',
        department_id: departments.find(d => d.name === 'Sales')?.id,
        level: 'company',
        type: 'committed',
        deadline: '2024-12-31',
        progress: 65
      },
      {
        objective: 'Optimize website performance and user experience',
        owner_id: '11111111-1111-1111-1111-111111111111',
        department_id: departments.find(d => d.name === 'Engineering')?.id,
        level: 'team',
        type: 'committed',
        deadline: '2024-11-15',
        progress: 78
      }
    ];

    const { data: insertedOKRs, error: okrError } = await supabase
      .from('okrs')
      .insert(sampleOKRs)
      .select();

    if (okrError) {
      console.error('Error inserting OKRs:', okrError);
      return;
    }

    console.log('Sample OKRs inserted:', insertedOKRs?.length);

    // Insert sample key results for each OKR
    if (insertedOKRs) {
      const sampleKeyResults = [
        // OKR 1: Customer satisfaction
        {
          okr_id: insertedOKRs[0].id,
          title: 'Achieve NPS score of 70+',
          target: '70',
          current: '68',
          progress: 85,
          status: 'on-track'
        },
        {
          okr_id: insertedOKRs[0].id,
          title: 'Reduce churn rate to below 5%',
          target: '5%',
          current: '6.2%',
          progress: 60,
          status: 'at-risk'
        },
        {
          okr_id: insertedOKRs[0].id,
          title: 'Implement 3 new customer success features',
          target: '3',
          current: '3',
          progress: 100,
          status: 'on-track'
        },
        // OKR 2: Mobile app
        {
          okr_id: insertedOKRs[1].id,
          title: 'Complete mobile app development',
          target: '100%',
          current: '75%',
          progress: 75,
          status: 'on-track'
        },
        {
          okr_id: insertedOKRs[1].id,
          title: 'Achieve 10k+ app downloads in first month',
          target: '10k',
          current: '0',
          progress: 0,
          status: 'off-track'
        },
        // OKR 3: Team collaboration
        {
          okr_id: insertedOKRs[2].id,
          title: 'Implement new collaboration tools',
          target: '100%',
          current: '100%',
          progress: 100,
          status: 'on-track'
        },
        {
          okr_id: insertedOKRs[2].id,
          title: 'Reduce meeting time by 20%',
          target: '20%',
          current: '18%',
          progress: 90,
          status: 'on-track'
        },
        // OKR 4: Market expansion
        {
          okr_id: insertedOKRs[3].id,
          title: 'Establish partnerships in 3 new countries',
          target: '3',
          current: '2',
          progress: 67,
          status: 'on-track'
        },
        {
          okr_id: insertedOKRs[3].id,
          title: 'Achieve 25% revenue growth in APAC',
          target: '25%',
          current: '15%',
          progress: 60,
          status: 'at-risk'
        },
        // OKR 5: Website optimization
        {
          okr_id: insertedOKRs[4].id,
          title: 'Improve page load speed to under 2 seconds',
          target: '2s',
          current: '2.3s',
          progress: 70,
          status: 'on-track'
        },
        {
          okr_id: insertedOKRs[4].id,
          title: 'Increase conversion rate by 15%',
          target: '15%',
          current: '12%',
          progress: 80,
          status: 'on-track'
        }
      ];

      const { error: krError } = await supabase
        .from('key_results')
        .insert(sampleKeyResults);

      if (krError) {
        console.error('Error inserting key results:', krError);
        return;
      }

      console.log('Sample key results inserted');
    }

    console.log('Sample data insertion completed successfully!');
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
};

export const clearSampleData = async () => {
  try {
    console.log('Clearing sample data...');
    
    // Delete key results first (due to foreign key constraints)
    const { error: krError } = await supabase
      .from('key_results')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Keep system records if any

    if (krError) {
      console.error('Error clearing key results:', krError);
      return;
    }

    // Delete OKRs
    const { error: okrError } = await supabase
      .from('okrs')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (okrError) {
      console.error('Error clearing OKRs:', okrError);
      return;
    }

    console.log('Sample data cleared successfully!');
  } catch (error) {
    console.error('Error clearing sample data:', error);
  }
};
