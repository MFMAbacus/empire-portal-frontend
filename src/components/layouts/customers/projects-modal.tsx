import * as React from "react";

import { AlertSeverity } from "@/types/alert";
import { CustomerProject } from "@/types/project";

import { Button } from "@/components/base/button";
import { Modal } from "@/components/base/modal";
import { Alert } from "@/components/base/alert";
import { LoadingFeedback } from "@/components/base/loading-feedback";
import { Table } from "@/components/base/table";
import { Map } from "@/components/base/map";
import { Pagination } from "@/components/base/pagination";

import { useForm } from "@/hooks/use-form";
import { makeGetCustomerProjectsService } from "@/services/get-customer-projects-service";
import { paginate } from "@/utility/paginate";

type ProjectsModalProps = {
  sessionId: string;
  phoneNumber: string;
  onClose: () => void;
};

export const ProjectsModal = ({
  sessionId,
  phoneNumber,
  onClose,
}: ProjectsModalProps): JSX.Element => {
  const [projects, setProjects] = React.useState<CustomerProject[] | null>(
    null
  );

  const handleSuccess = React.useCallback((data: unknown) => {
    const projects = data as CustomerProject[];
    setProjects(projects);
  }, []);

  const [page, setPage] = React.useState<number>(1);

  const { isLoading, alertData, submit } = useForm({
    serviceMaker: makeGetCustomerProjectsService,
    onSuccess: handleSuccess,
  });

  const [totalPages, paginatedProjects] = React.useMemo(() => {
    if (!projects) {
      return [1, []];
    }

    const pagination = paginate(projects, {
      currentPage: page,
      totalPerPage: 5,
    });

    return [pagination.totalPages, pagination.records];
  }, [projects, page]);

  const loadCustomerProjects = React.useCallback(() => {
    submit({
      sessionId,
      phoneNumber,
    });
  }, [sessionId, phoneNumber, submit]);

  React.useEffect(() => {
    loadCustomerProjects();
  }, [loadCustomerProjects]);

  return (
    <Modal>
      <Modal.Header title="Customer Projects" />
      <Modal.Body>
        {alertData !== null && alertData.severity !== AlertSeverity.SUCCESS && (
          <Alert message={alertData.message} severity={alertData.severity} />
        )}
        {isLoading && (
          <LoadingFeedback feedback="Loading customer projects, please wait." />
        )}
        {!isLoading && projects !== null && (
          <Table
            head={
              <Table.Row>
                <Table.Header value="PROJECT ID" />
                <Table.Header value="UNIT ID" />
              </Table.Row>
            }
            body={
              <Map
                items={paginatedProjects || []}
                renderItem={(project) => (
                  <Table.Row key={project.unitId}>
                    <Table.Cell>{project.projectId}</Table.Cell>
                    <Table.Cell>{project.unitId}</Table.Cell>
                  </Table.Row>
                )}
              />
            }
          />
        )}
        {!isLoading && projects !== null && projects.length === 0 && (
          <Alert
            className="mt-1"
            message="No results."
            severity={AlertSeverity.SUCCESS}
          />
        )}
        {!isLoading && projects !== null && (
          <Pagination page={page} totalPages={totalPages} onPage={setPage} />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button label="CLOSE" onClick={onClose} />
      </Modal.Footer>
    </Modal>
  );
};
