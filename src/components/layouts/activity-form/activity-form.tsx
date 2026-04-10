import * as React from 'react';

import {Map} from '@/components/base/map';
import {Button} from '@/components/base/button';
import {Paper} from '@/components/base/paper';
import {Grid} from '@/components/base/grid';
import {TextInput} from '@/components/base/text-input';
import {TextAreaInput} from '@/components/base/text-area-input';
import {ListInput} from '@/components/base/list-input';
import {DateInput} from '@/components/base/date-input';
import {Tabs} from '@/components/base/tabs';
import {Checkbox} from '@/components/base/checkbox';
import {Table} from '@/components/base/table';

import {Dashboard} from '@/components/layouts/dashboard';
import {Actionbar} from '@/components/layouts/action-bar';

import {ArrowLeftIcon} from '@/components/icons/arrow-left-icon';
import {CheckIcon} from '@/components/icons/check-icon';

import {CustomerRecord} from '@/types/customers';
import {
  ActivityStatusRecord,
  ActivityTypeRecord,
  ActivityCategoryRecord,
  ActivityPriorityRecord,
  ActivityRecord,
} from '@/types/activities';
import {StaffRecord} from '@/types/staff';
import {ProjectRecord} from '@/types/projects';
import {UnitRecord} from '@/types/units';

import {getActivity} from '@/services/get-activity';
import {createActivity} from '@/services/create-activity';
import {updateActivity} from '@/services/update-activity';
import {getActivitiesTypes} from '@/services//get-activites-types';
import {getActivitiesPriorities} from '@/services//get-activites-priorities';
import {getActivitiesStatuses} from '@/services//get-activites-statuses';
import {getActivitiesCategories} from '@/services//get-activites-categories';
import {getStaff} from '@/services//get-staff';
import {getCustomers} from '@/services//get-customers';
import {getProjects} from '@/services//get-projects';
import {getUnits} from '@/services//get-units';

import cls from './activity-form.module.scss';

const types = getActivitiesTypes();
const priorities = getActivitiesPriorities();
const statuses = getActivitiesStatuses();
const categories = getActivitiesCategories();
const staff = getStaff();
const customers = getCustomers();
const projects = getProjects();
const units = getUnits();

type ActivityFormProps = {
  title: string;
  activityId?: string;
  onBack: () => void;
  onBackToView: () => void;
};

export const ActivityForm = ({
  title,
  activityId,
  onBack,
  onBackToView,
}: ActivityFormProps): JSX.Element => {
  const [
    currentTab,
    setCurrentTab,
  ] = React.useState<string>('details');

  const activity = React.useMemo(() => {
    if (typeof activityId === 'undefined') {
      return null;
    }
    return getActivity(activityId);
  }, [activityId]);

  const [
    type,
    setType,
  ] = React.useState<ActivityTypeRecord>(() => {
    if (activity === null) {
      return types[0];
    }
    const type = types.find((current) => {
      return current.id === activity.typeId;
    });
    if (typeof type === 'undefined') {
      return types[0];
    }
    return type;
  });

  const [
    id,
    setId,
  ] = React.useState<string>(() => {
    if (activity === null) {
      return '';
    }
    return activity.id;
  });

  React.useEffect(() => {
    if (activity) {
      return;
    }
    if (type.id === 'task') {
      setId('T-000');
    } else {
      setId('R-000');
    }
  }, [type, activity]);

  const [
    subject,
    setSubject,
  ] = React.useState<string>(() => {
    if (activity === null) {
      return '';
    }
    return activity.subject;
  });

  const [
    description,
    setDescription,
  ] = React.useState<string | null>(() => {
    if (activity === null) {
      return null;
    }
    return activity.description;
  });

  const [
    status,
    setStatus,
  ] = React.useState<ActivityStatusRecord>(() => {
    if (activity === null) {
      return statuses[0];
    }
    const status = statuses.find((current) => {
      return current.id === activity.statusId;
    });
    if (typeof status === 'undefined') {
      return statuses[0];
    }
    return status;
  });

  const [
    assignee,
    setAssignee,
  ] = React.useState<StaffRecord | null>(() => {
    if (activity === null) {
      return null;
    }
    const assignee = staff.find((current) => {
      return current.id === activity.assigendToId;
    });
    if (typeof assignee === 'undefined') {
      return null;
    }
    return assignee;
  });

  const [
    dueDate,
    setDueDate,
  ] = React.useState<string | null>(() => {
    if (activity === null) {
      return '';
    }
    return activity.dueDate;
  });

  const [
    customer,
    setCustomer,
  ] = React.useState<CustomerRecord | null>(() => {
    if (activity === null) {
      return null;
    }
    const customer = customers.find((current) => {
      return current.id === activity.customerId;
    });
    if (typeof customer === 'undefined') {
      return null;
    }
    return customer;
  });

  const [
    entryContact,
    setEntryContact,
  ] = React.useState<string | null>(() => {
    if (activity === null) {
      return null;
    }
    return activity.entryContact;
  });

  const [
    visitDate,
    setVisitDate,
  ] = React.useState<string | null>(() => {
    if (activity === null) {
      return null;
    }
    return activity.visitDate;
  });

  const [
    category,
    setCategory,
  ] = React.useState<ActivityCategoryRecord>(() => {
    if (activity === null) {
      return categories[0];
    }
    const category = categories.find((current) => {
      return current.id === activity.categoryId;
    });
    if (typeof category === 'undefined') {
      return categories[0];
    }
    return category;
  });

  const [
    priority,
    setPriority,
  ] = React.useState<ActivityPriorityRecord>(() => {
    if (activity === null) {
      return priorities[0];
    }
    const priority = priorities.find((current) => {
      return current.id === activity.priorityId;
    });
    if (typeof priority === 'undefined') {
      return priorities[0];
    }
    return priority;
  });

  const [
    project,
    setProject,
  ] = React.useState<ProjectRecord | null>(() => {
    if (activity === null) {
      return null;
    }
    const project = projects.find((current) => {
      return current.id === activity.projectId;
    });
    if (typeof project === 'undefined') {
      return null;
    }
    return project;
  });

  const [
    unit,
    setUnit,
  ] = React.useState<UnitRecord | null>(() => {
    if (activity === null) {
      return null;
    }
    const unit = units.find((current) => {
      return current.id === activity.unitId;
    });
    if (typeof unit === 'undefined') {
      return null;
    }
    return unit;
  });

  const [
    location,
    setLocation,
  ] = React.useState<string | null>(() => {
    if (activity === null) {
      return null;
    }
    return activity.location;
  });

  const canSubmit = id !== '' && subject !== '';

  const handleSave = () => {
    const newActivity: ActivityRecord = {
      id,
      typeId: type.id,
      categoryId: category.id,
      priorityId: priority.id,
      customerId: customer !== null ? customer.id : null,
      statusId: status.id,
      assigendToId: assignee !== null ? assignee.id : null,
      subject,
      description,
      entryContact,
      visitDate,
      dueDate,
      projectId: project !== null ? project.id : null,
      unitId: unit !== null ? unit.id : null,
      location,
      createdAt: '2023-05-23',
      updatedAt: '2023-05-23',
    };
    if (typeof activityId === 'undefined') {
      createActivity(newActivity);
      onBack();
    } else {
      updateActivity({
        activityId,
        activity: newActivity,
      });
      if (activity && newActivity.id !== activityId) {
        onBack();
      } else {
        onBackToView();
      }
    }
  };

  return (
    <Dashboard.Content>
      <Actionbar title={title}>
        <Button
          label='SAVE'
          icon={<CheckIcon />}
          isDisabled={!canSubmit}
          onClick={handleSave}
        />
        <Button
          label='GO BACK'
          icon={<ArrowLeftIcon />}
          onClick={() => {
            if (activityId) {
              onBackToView();
            } else {
              onBack();
            }
          }}
        />
      </Actionbar>
      <Dashboard.Page>
        <Tabs className='mb-1'>
          <Tabs.Item
            title='Details'
            isActive={currentTab === 'details'}
            onClick={() => setCurrentTab('details')}
          />
          <Tabs.Item
            title='Sub Tasks'
            isActive={currentTab === 'sub-tasks'}
            onClick={() => setCurrentTab('sub-tasks')}
          />
        </Tabs>
        {currentTab === 'details' ? (
          <React.Fragment>
            <div className={cls['layout']}>
              <Paper>
                <Paper.Title value='Activity Details' />
                <Grid>
                  <Grid.Cell size={Grid.CellSize.S4}>
                    <ListInput
                      className='w-100'
                      label='Type'
                      value={type.label}
                      placeholder='Select activity type'
                      isRequired>
                      {(onClose) => (
                        <Map
                          items={types}
                          renderItem={(item) => (
                            <ListInput.Item
                              key={item.id}
                              label={item.label}
                              isActive={item.id === type.id}
                              onClick={() => {
                                setType(item);
                                onClose();
                              }}
                            />
                          )}
                        />
                      )}
                    </ListInput>
                  </Grid.Cell>
                  <Grid.Cell size={Grid.CellSize.S4}>
                    <TextInput
                      className='w-100'
                      label='ID'
                      placeholder='Enter activity ID.'
                      value={id}
                      isRequired
                      hasInitialFocus
                      onChange={setId}
                    />
                  </Grid.Cell>
                  <Grid.Cell size={Grid.CellSize.S4}>
                    <TextInput
                      className='w-100'
                      label='Subject'
                      placeholder='Enter activity subject.'
                      value={subject}
                      isRequired
                      onChange={setSubject}
                    />
                  </Grid.Cell>
                </Grid>
                <Grid>
                  <Grid.Cell size={Grid.CellSize.S12}>
                    <TextAreaInput
                      className='w-100'
                      label='Description'
                      placeholder='Enter activity description.'
                      value={description !== null ? description : ''}
                      onChange={setDescription}
                    />
                  </Grid.Cell>
                </Grid>
                <Grid>
                  <Grid.Cell size={Grid.CellSize.S4}>
                    <ListInput
                      className='w-100'
                      label='Status'
                      value={status.label}
                      placeholder='Select activity status'
                      isRequired>
                      {(onClose) => (
                        <Map
                          items={statuses}
                          renderItem={(item) => (
                            <ListInput.Item
                              key={item.id}
                              label={item.label}
                              isActive={item.id === status.id}
                              onClick={() => {
                                setStatus(item);
                                onClose();
                              }}
                            />
                          )}
                        />
                      )}
                    </ListInput>
                  </Grid.Cell>
                  <Grid.Cell size={Grid.CellSize.S4}>
                    <ListInput
                      className='w-100'
                      label='Assigned To'
                      value={assignee !== null ? assignee.fullName : undefined}
                      placeholder='Select activity assignee'>
                      {(onClose) => (
                        <React.Fragment>
                          <ListInput.Item
                            label='None'
                            isActive={assignee === null}
                            onClick={() => {
                              setAssignee(null);
                              onClose();
                            }}
                          />
                          <Map
                            items={staff}
                            renderItem={(item) => (
                              <ListInput.Item
                                key={item.id}
                                label={item.fullName}
                                isActive={item.id === (assignee && assignee.id)}
                                onClick={() => {
                                  setAssignee(item);
                                  onClose();
                                }}
                              />
                            )}
                          />
                        </React.Fragment>
                      )}
                    </ListInput>
                  </Grid.Cell>
                  <Grid.Cell size={Grid.CellSize.S4}>
                    <DateInput
                      className='w-100'
                      label='Due Date'
                      placeholder='Enter activity due date.'
                      value={dueDate !== null ? dueDate : ''}
                      onChange={setDueDate}
                    />
                  </Grid.Cell>
                </Grid>
              </Paper>
              <Paper>
                <Paper.Title value='Customer Details' />
                <Grid>
                  <ListInput
                    className='w-100'
                    label='Customer'
                    value={customer !== null ?
                      customer.fullName :
                      undefined
                    }
                    placeholder='Select activity customer'>
                    {(onClose) => (
                      <React.Fragment>
                        <ListInput.Item
                          label='None'
                          isActive={customer === null}
                          onClick={() => {
                            setCustomer(null);
                            onClose();
                          }}
                        />
                        <Map
                          items={customers}
                          renderItem={(item) => (
                            <ListInput.Item
                              key={item.id}
                              label={item.fullName}
                              isActive={item.id === (customer && customer.id)}
                              onClick={() => {
                                setCustomer(item);
                                onClose();
                              }}
                            />
                          )}
                        />
                      </React.Fragment>
                    )}
                  </ListInput>
                </Grid>
                <Grid>
                  <TextInput
                    className='w-100'
                    label='Entry Contact'
                    placeholder='Enter customer entry contact.'
                    value={entryContact}
                    onChange={setEntryContact}
                  />
                </Grid>
                <Grid>
                  <DateInput
                    className='w-100'
                    label='Visit Date'
                    placeholder='Enter customer visit date.'
                    value={visitDate !== null ? visitDate : ''}
                    onChange={setVisitDate}
                  />
                </Grid>
              </Paper>
            </div>
            <Paper className='mt-2'>
              <Paper.Title value='Other Details' />
              <Grid>
                <Grid.Cell size={Grid.CellSize.S4}>
                  <ListInput
                    className='w-100'
                    label='Category'
                    value={category.label}
                    placeholder='Select activity category'
                    isRequired>
                    {(onClose) => (
                      <Map
                        items={categories}
                        renderItem={(item) => (
                          <ListInput.Item
                            key={item.id}
                            label={item.label}
                            isActive={item.id === (category && category.id)}
                            onClick={() => {
                              setCategory(item);
                              onClose();
                            }}
                          />
                        )}
                      />
                    )}
                  </ListInput>
                </Grid.Cell>
                <Grid.Cell size={Grid.CellSize.S4}>
                  <ListInput
                    className='w-100'
                    label='Priority'
                    value={priority.label}
                    placeholder='Select activity priority'
                    isRequired>
                    {(onClose) => (
                      <Map
                        items={priorities}
                        renderItem={(item) => (
                          <ListInput.Item
                            key={item.id}
                            label={item.label}
                            isActive={item.id === priority.id}
                            onClick={() => {
                              setPriority(item);
                              onClose();
                            }}
                          />
                        )}
                      />
                    )}
                  </ListInput>
                </Grid.Cell>
                <Grid.Cell size={Grid.CellSize.S4}>
                  <ListInput
                    className='w-100'
                    label='Project'
                    value={project !== null ? project.name : undefined}
                    placeholder='Select activity project'>
                    {(onClose) => (
                      <React.Fragment>
                        <ListInput.Item
                          label='None'
                          isActive={project === null}
                          onClick={() => {
                            setProject(null);
                            onClose();
                          }}
                        />
                        <Map
                          items={projects}
                          renderItem={(item) => (
                            <ListInput.Item
                              key={item.id}
                              label={item.name}
                              isActive={item.id === (project && project.id)}
                              onClick={() => {
                                setProject(item);
                                onClose();
                              }}
                            />
                          )}
                        />
                      </React.Fragment>
                    )}
                  </ListInput>
                </Grid.Cell>
              </Grid>
              <Grid>
                <Grid.Cell size={Grid.CellSize.S4}>
                  <ListInput
                    className='w-100'
                    label='Unit'
                    value={unit !== null ? unit.name : undefined}
                    placeholder='Select activity unit'>
                    {(onClose) => (
                      <React.Fragment>
                        <ListInput.Item
                          label='None'
                          isActive={unit === null}
                          onClick={() => {
                            setUnit(null);
                            onClose();
                          }}
                        />
                        <Map
                          items={units}
                          renderItem={(item) => (
                            <ListInput.Item
                              key={item.id}
                              label={item.name}
                              isActive={item.id === (unit && unit.id)}
                              onClick={() => {
                                setUnit(item);
                                onClose();
                              }}
                            />
                          )}
                        />
                      </React.Fragment>
                    )}
                  </ListInput>
                </Grid.Cell>
                <Grid.Cell size={Grid.CellSize.S8}>
                  <TextInput
                    className='w-100'
                    label='Location'
                    placeholder='Enter activity location.'
                    value={location}
                    onChange={setLocation}
                  />
                </Grid.Cell>
              </Grid>
            </Paper>
          </React.Fragment>
        ): (
          <Paper>
            <Table
              head={(
                <Table.Row>
                  <Table.Header
                    value='COMPLETE'
                    align={Table.Align.CENTER}
                  />
                  <Table.Header value='TITLE'
                  />
                  <Table.Header
                    value='ASSIGNED TO'
                    align={Table.Align.CENTER}
                  />
                </Table.Row>
              )}
              body={(
                <Map
                  items={subTasksRecords}
                  renderItem={(item) => (
                    <Table.Row key={item.id}>
                      <Table.Cell align={Table.Align.CENTER}>
                        <SubTaskCheckbox />
                      </Table.Cell>
                      <Table.Cell>
                        {item.title}
                      </Table.Cell>
                      <Table.Cell align={Table.Align.CENTER}>
                        <SubTaskAssignee />
                      </Table.Cell>
                    </Table.Row>
                  )}
                />
              )}
            />
          </Paper>
        )}
      </Dashboard.Page>
    </Dashboard.Content>
  );
};

const SubTaskCheckbox = (): JSX.Element => {
  const [
    isChecked,
    setIsChecked,
  ] = React.useState<boolean>(false);

  return (
    <Checkbox
      label={isChecked ? 'Yes' : 'No'}
      isChecked={isChecked}
      onChange={(value) => setIsChecked(value)}
    />
  );
};

const SubTaskAssignee = (): JSX.Element => {
  const [
    assignee,
    setAssignee,
  ] = React.useState<StaffRecord | null>(null);

  return (
    <ListInput
      value={assignee !== null ? assignee.fullName : undefined}
      placeholder='Select sub-task assignee'>
      {(onClose) => (
        <React.Fragment>
          <ListInput.Item
            label='None'
            isActive={assignee === null}
            onClick={() => {
              setAssignee(null);
              onClose();
            }}
          />
          <Map
            items={staff}
            renderItem={(item) => (
              <ListInput.Item
                key={item.id}
                label={item.fullName}
                isActive={item.id === (assignee && assignee.id)}
                onClick={() => {
                  setAssignee(item);
                  onClose();
                }}
              />
            )}
          />
        </React.Fragment>
      )}
    </ListInput>
  );
};

type SubTaskRecord = {
  id: string;
  title: string;
};

const subTasksRecords: SubTaskRecord[] = [
  {
    id: 'ST-0001',
    title: 'Check oil',
  },
  {
    id: 'ST-0002',
    title: 'Check interior and exterior',
  },
  {
    id: 'ST-0003',
    title: 'Apply a wood protectant',
  },
  {
    id: 'ST-0004',
    title: 'Lubricate hinges',
  },
  {
    id: 'ST-0005',
    title: 'Check for stability',
  },
];
