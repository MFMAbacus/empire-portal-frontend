import * as React from "react";

import { Button } from "@/components/base/button";
import { Modal } from "@/components/base/modal";
import { TextInput } from "@/components/base/text-input";
import { Grid } from "@/components/base/grid";

import { FilterIcon } from "@/components/icons/filter-icon";

type UnitFilterModalProps = {
  defaultUnitCode: string;
  onFilter: (unitCode: string) => void;
  onClose: () => void;
};

export const UnitFilterModal = ({
  defaultUnitCode,
  onFilter,
  onClose,
}: UnitFilterModalProps): JSX.Element => {
  const [unitCode, setUnitCode] = React.useState<string>(defaultUnitCode);

  return (
    <Modal>
      <Modal.Header title="Filter by Unit" />
      <Modal.Body>
        <Grid>
          <TextInput
            className="w-100"
            label="Unit Code"
            placeholder="Enter unit code."
            value={unitCode}
            onChange={(value) => setUnitCode(value)}
          />
        </Grid>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="ml-05"
          label="FILTER"
          icon={<FilterIcon />}
          onClick={() => {
            onFilter(unitCode);
            onClose();
          }}
        />
        <Button
          className="ml-05"
          label="CLEAR"
          onClick={() => {
            onFilter("");
            onClose();
          }}
        />
        <Button label="CLOSE" onClick={onClose} />
      </Modal.Footer>
    </Modal>
  );
};