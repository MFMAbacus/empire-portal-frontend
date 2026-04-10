import * as React from "react";

import { Map } from "@/components/base/map";
import { Button } from "@/components/base/button";
import { Paper } from "@/components/base/paper";
import { TextAreaInput } from "@/components/base/text-area-input";
import { TextInput } from "@/components/base/text-input";
import { DateInput } from "@/components/base/date-input";
import { Grid } from "@/components/base/grid";
import { Checkbox } from "@/components/base/checkbox";
import { ListInput } from "@/components/base/list-input";

import { Dashboard } from "@/components/layouts/dashboard";
import { Actionbar } from "@/components/layouts/action-bar";

import { CheckIcon } from "@/components/icons/check-icon";
import { ArrowLeftIcon } from "@/components/icons/arrow-left-icon";
import { AnnouncementRecord } from "@/types/announcements";

import { createAnnouncement } from "@/services/create-announcement";
import { updateAnnouncement } from "@/services/update-announcement";
import { getAnnouncement } from "@/services/get-announcement";

import { useDateValidation } from "@/hooks/use-dateValidation";

type AnnouncementFormProps = {
  header: string;
  announcementId?: string;
  onBack: () => void;
};

type DateTypes = {
  minDate?: string;
  maxDate?: string;
};

export const AnnouncementForm = ({
  header,
  announcementId,
  onBack,
}: AnnouncementFormProps): JSX.Element => {
  const announcement = React.useMemo(() => {
    if (typeof announcementId === "undefined") {
      return null;
    }
    return getAnnouncement(announcementId);
  }, [announcementId]);

  const [id, setId] = React.useState<string>(() => {
    if (!announcement) {
      return "A-000";
    }
    return announcement.id;
  });

  const [title, setTitle] = React.useState<string>(() => {
    if (!announcement) {
      return "";
    }
    return announcement.title;
  });

  const [description, setDescription] = React.useState<string>(() => {
    if (!announcement) {
      return "";
    }
    return announcement.description;
  });

  const [expirationDate, setExpirationDate] = React.useState<string>(() => {
    if (!announcement) {
      return "";
    }
    if (!announcement.expiresAt) {
      return "";
    }
    return announcement.expiresAt;
  });

  const [setlectedCustomersIds, setSetlectedCustomersIds] = React.useState<
    string[]
  >([]);

  const [setlectedProjectsIds, setSetlectedProjectsIds] = React.useState<
    string[]
  >([]);

  const [setlectedBuildingsIds, setSetlectedBuildingsIds] = React.useState<
    string[]
  >([]);

  const [setlectedFloorsIds, setSetlectedFloorsIds] = React.useState<string[]>(
    []
  );

  const [setlectedUnitsIds, setSetlectedUnitsIds] = React.useState<string[]>(
    []
  );

  const [doesExpire, setDoesExpire] = React.useState<boolean>(() => {
    if (!announcement) {
      return false;
    }
    if (!announcement.expiresAt) {
      return false;
    }
    return true;
  });

  React.useEffect(() => {
    if (!doesExpire) {
      setExpirationDate("");
    }
  }, [doesExpire]);

  const handleSelectCustomer = (customerId: string) => {
    setSetlectedCustomersIds((setlectedCustomers) => {
      if (customerId === "%all") {
        return customers.map((currentCustomer) => {
          return currentCustomer.id;
        });
      }
      if (customerId === "%none") {
        return [];
      }
      if (setlectedCustomers.includes(customerId)) {
        return setlectedCustomers.filter((currentCustomerId) => {
          return currentCustomerId !== customerId;
        });
      }
      return [...setlectedCustomers, customerId];
    });
  };

  const handleSelectProject = (projectId: string) => {
    setSetlectedProjectsIds((setlectedProjects) => {
      if (projectId === "%all") {
        return projects.map((currentProject) => {
          return currentProject.id;
        });
      }
      if (projectId === "%none") {
        return [];
      }
      if (setlectedProjects.includes(projectId)) {
        return setlectedProjects.filter((currentProjectId) => {
          return currentProjectId !== projectId;
        });
      }
      return [...setlectedProjects, projectId];
    });
  };

  const handleSelectBuilding = (buildingId: string) => {
    setSetlectedBuildingsIds((setlectedBuildings) => {
      if (buildingId === "%all") {
        return buildings.map((currentBuilding) => {
          return currentBuilding.id;
        });
      }
      if (buildingId === "%none") {
        return [];
      }
      if (setlectedBuildings.includes(buildingId)) {
        return setlectedBuildings.filter((currentBuildingId) => {
          return currentBuildingId !== buildingId;
        });
      }
      return [...setlectedBuildings, buildingId];
    });
  };

  const handleSelectFloor = (floorId: string) => {
    setSetlectedFloorsIds((setlectedFloors) => {
      if (floorId === "%all") {
        return floors.map((currentFloor) => {
          return currentFloor.id;
        });
      }
      if (floorId === "%none") {
        return [];
      }
      if (setlectedFloors.includes(floorId)) {
        return setlectedFloors.filter((currentFloorId) => {
          return currentFloorId !== floorId;
        });
      }
      return [...setlectedFloors, floorId];
    });
  };

  const handleSelectUnit = (unitId: string) => {
    setSetlectedUnitsIds((setlectedUnits) => {
      if (unitId === "%all") {
        return units.map((currentUnit) => {
          return currentUnit.id;
        });
      }
      if (unitId === "%none") {
        return [];
      }
      if (setlectedUnits.includes(unitId)) {
        return setlectedUnits.filter((currentUnitId) => {
          return currentUnitId !== unitId;
        });
      }
      return [...setlectedUnits, unitId];
    });
  };

  const canSave = id !== "" && title !== "" && description !== "";

  const handleSave = () => {
    const newAnnouncement: AnnouncementRecord = {
      id,
      title,
      description,
      createdAt: "2023-05-23",
      expiresAt: expirationDate !== "" ? expirationDate : null,
    };
    if (!announcementId) {
      createAnnouncement(newAnnouncement);
    } else {
      updateAnnouncement({
        announcementId,
        announcement: newAnnouncement,
      });
    }
    onBack();
  };

  return (
    <Dashboard.Content>
      <Actionbar title={header}>
        <Button
          label="SAVE"
          icon={<CheckIcon />}
          isDisabled={!canSave}
          onClick={handleSave}
        />
        <Button label="GO BACK" icon={<ArrowLeftIcon />} onClick={onBack} />
      </Actionbar>
      <Dashboard.Page>
        <Paper>
          <Paper.Title value="Details" />
          <Grid>
            <Grid.Cell size={Grid.CellSize.S4}>
              <TextInput
                className="w-100"
                label="ID"
                placeholder="Enter announcement ID."
                value={id}
                isRequired
                onChange={setId}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S4}>
              <TextInput
                className="w-100"
                label="Title"
                placeholder="Enter announcement title."
                value={title}
                isRequired
                onChange={setTitle}
              />
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S4}>
              <Checkbox
                className="mr-2 mt-2"
                label="Expires"
                isChecked={doesExpire}
                onChange={setDoesExpire}
              />
              <DateInput
                className="w-100"
                label="Expiration Date"
                placeholder="Enter announcement expiration date."
                value={expirationDate}
                isDisabled={!doesExpire}
                onChange={setExpirationDate}
              />
            </Grid.Cell>
          </Grid>
          <Grid>
            <Grid.Cell size={Grid.CellSize.S12}>
              <TextAreaInput
                className="w-100"
                label="Description"
                placeholder="Enter announcement description."
                value={description}
                isRequired
                onChange={setDescription}
              />
            </Grid.Cell>
          </Grid>
          <Paper.Title value="Recipients" />
          <Grid>
            <Grid.Cell size={Grid.CellSize.S4}>
              <ListInput
                className="w-100"
                label="Customers"
                value={
                  setlectedCustomersIds.length !== 0
                    ? `${setlectedCustomersIds.length} selected customer(s)`
                    : undefined
                }
                placeholder="Select customers"
              >
                <ListInput.Item
                  label="None"
                  isActive={setlectedCustomersIds.length === 0}
                  onClick={() => handleSelectCustomer("%none")}
                />
                <ListInput.Item
                  label="All"
                  isActive={customers.length === setlectedCustomersIds.length}
                  onClick={() => handleSelectCustomer("%all")}
                />
                <Map
                  items={customers}
                  renderItem={(customer) => {
                    return (
                      <ListInput.Item
                        key={customer.id}
                        label={`${customer.firstName} ${customer.lastName}`}
                        isActive={setlectedCustomersIds.includes(customer.id)}
                        onClick={() => handleSelectCustomer(customer.id)}
                      />
                    );
                  }}
                />
              </ListInput>
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S4}>
              <ListInput
                className="w-100"
                label="Projects"
                value={
                  setlectedProjectsIds.length !== 0
                    ? `${setlectedProjectsIds.length} selected project(s)`
                    : undefined
                }
                placeholder="Select projects"
              >
                <ListInput.Item
                  label="None"
                  isActive={setlectedProjectsIds.length === 0}
                  onClick={() => handleSelectProject("%none")}
                />
                <ListInput.Item
                  label="All"
                  isActive={projects.length === setlectedProjectsIds.length}
                  onClick={() => handleSelectProject("%all")}
                />
                <Map
                  items={projects}
                  renderItem={(project) => {
                    return (
                      <ListInput.Item
                        key={project.id}
                        label={project.name}
                        isActive={setlectedProjectsIds.includes(project.id)}
                        onClick={() => handleSelectProject(project.id)}
                      />
                    );
                  }}
                />
              </ListInput>
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S4}>
              <ListInput
                className="w-100"
                label="Buildings"
                value={
                  setlectedBuildingsIds.length !== 0
                    ? `${setlectedBuildingsIds.length} selected building(s)`
                    : undefined
                }
                placeholder="Select buildings"
              >
                <ListInput.Item
                  label="None"
                  isActive={setlectedBuildingsIds.length === 0}
                  onClick={() => handleSelectBuilding("%none")}
                />
                <ListInput.Item
                  label="All"
                  isActive={buildings.length === setlectedBuildingsIds.length}
                  onClick={() => handleSelectBuilding("%all")}
                />
                <Map
                  items={buildings}
                  renderItem={(building) => {
                    return (
                      <ListInput.Item
                        key={building.id}
                        label={building.name}
                        isActive={setlectedBuildingsIds.includes(building.id)}
                        onClick={() => handleSelectBuilding(building.id)}
                      />
                    );
                  }}
                />
              </ListInput>
            </Grid.Cell>
          </Grid>
          <Grid>
            <Grid.Cell size={Grid.CellSize.S4}>
              <ListInput
                className="w-100"
                label="Floors"
                value={
                  setlectedFloorsIds.length !== 0
                    ? `${setlectedFloorsIds.length} selected floor(s)`
                    : undefined
                }
                placeholder="Select floors"
              >
                <ListInput.Item
                  label="None"
                  isActive={setlectedFloorsIds.length === 0}
                  onClick={() => handleSelectFloor("%none")}
                />
                <ListInput.Item
                  label="All"
                  isActive={floors.length === setlectedFloorsIds.length}
                  onClick={() => handleSelectFloor("%all")}
                />
                <Map
                  items={floors}
                  renderItem={(floor) => {
                    return (
                      <ListInput.Item
                        key={floor.id}
                        label={floor.name}
                        isActive={setlectedFloorsIds.includes(floor.id)}
                        onClick={() => handleSelectFloor(floor.id)}
                      />
                    );
                  }}
                />
              </ListInput>
            </Grid.Cell>
            <Grid.Cell size={Grid.CellSize.S4}>
              <ListInput
                className="w-100"
                label="Units"
                value={
                  setlectedUnitsIds.length !== 0
                    ? `${setlectedUnitsIds.length} selected unit(s)`
                    : undefined
                }
                placeholder="Select units"
              >
                <ListInput.Item
                  label="None"
                  isActive={setlectedUnitsIds.length === 0}
                  onClick={() => handleSelectUnit("%none")}
                />
                <ListInput.Item
                  label="All"
                  isActive={units.length === setlectedUnitsIds.length}
                  onClick={() => handleSelectUnit("%all")}
                />
                <Map
                  items={units}
                  renderItem={(unit) => {
                    return (
                      <ListInput.Item
                        key={unit.id}
                        label={unit.name}
                        isActive={setlectedUnitsIds.includes(unit.id)}
                        onClick={() => handleSelectUnit(unit.id)}
                      />
                    );
                  }}
                />
              </ListInput>
            </Grid.Cell>
          </Grid>
        </Paper>
      </Dashboard.Page>
    </Dashboard.Content>
  );
};

type CustomerRecord = {
  id: string;
  firstName: string;
  lastName: string;
};

const customers: CustomerRecord[] = [
  {
    id: "R-000001",
    firstName: "Ada",
    lastName: "Gerhold",
  },
  {
    id: "R-0000018",
    firstName: "Yesenia",
    lastName: "Stanton",
  },
  {
    id: "U-000004",
    firstName: "Adrien",
    lastName: "Gislason",
  },
  {
    id: "T-000006",
    firstName: "Alice",
    lastName: "Kshlerin",
  },
  {
    id: "R-000025",
    firstName: "Floyd",
    lastName: "Hickle",
  },
  {
    id: "U-000022",
    firstName: "Cathryn",
    lastName: "Maggio",
  },
  {
    id: "T-000004",
    firstName: "Fidel",
    lastName: "Weimann",
  },
  {
    id: "U-000055",
    firstName: "Stan",
    lastName: "Kertzmann",
  },
  {
    id: "T-000011",
    firstName: "Aglae",
    lastName: "Howe",
  },
];

type ProjectRecord = {
  id: string;
  name: string;
};

const projects: ProjectRecord[] = [
  {
    id: "P-00001",
    name: "Project 1",
  },
  {
    id: "P-00002",
    name: "Project 2",
  },
  {
    id: "P-00003",
    name: "Project 3",
  },
];

type BuildingRecord = {
  id: string;
  name: string;
};

const buildings: BuildingRecord[] = [
  {
    id: "B-00001",
    name: "Building 1",
  },
  {
    id: "B-00002",
    name: "Building 2",
  },
];

type FloorRecord = {
  id: string;
  name: string;
};

const floors: FloorRecord[] = [
  {
    id: "F-00001",
    name: "Floor 1",
  },
  {
    id: "F-00002",
    name: "Floor 2",
  },
  {
    id: "F-00003",
    name: "Floor 3",
  },
  {
    id: "F-00004",
    name: "Floor 4",
  },
];

type UnitRecord = {
  id: string;
  name: string;
};

const units: UnitRecord[] = [
  {
    id: "U-00001",
    name: "Unit 1",
  },
  {
    id: "U-00002",
    name: "Unit 2",
  },
  {
    id: "U-00003",
    name: "Unit 3",
  },
  {
    id: "U-00004",
    name: "Unit 4",
  },
  {
    id: "U-00005",
    name: "Unit 5",
  },
];
