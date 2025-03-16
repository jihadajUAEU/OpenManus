import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  updateStepStatus,
  setActiveStep,
  addStep,
  removeStep,
  updateStepDependencies,
} from '../../store/flowSlice.ts';
import { FlowStep, PlanStepStatus } from '../../types';

interface StepItemProps {
  step: FlowStep;
  isActive: boolean;
  onStatusChange: (status: PlanStepStatus) => void;
  onSelect: () => void;
  onRemove: () => void;
}

const StepItem: React.FC<StepItemProps> = ({
  step,
  isActive,
  onStatusChange,
  onSelect,
  onRemove,
}) => {
  const statusClasses = {
    [PlanStepStatus.NOT_STARTED]: 'step-not-started',
    [PlanStepStatus.IN_PROGRESS]: 'step-in-progress',
    [PlanStepStatus.COMPLETED]: 'step-completed',
    [PlanStepStatus.BLOCKED]: 'step-blocked',
  };

  const statusIcons = {
    [PlanStepStatus.NOT_STARTED]: '[ ]',
    [PlanStepStatus.IN_PROGRESS]: '[→]',
    [PlanStepStatus.COMPLETED]: '[✓]',
    [PlanStepStatus.BLOCKED]: '[!]',
  };

  return (
    <div
      className={`flow-step ${statusClasses[step.status]} ${
        isActive ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={onSelect}
    >
      <span className="mr-2">{statusIcons[step.status]}</span>
      <span className="flex-1">{step.description}</span>
      <select
        value={step.status}
        onChange={(e) => onStatusChange(e.target.value as PlanStepStatus)}
        onClick={(e) => e.stopPropagation()}
        className="ml-2 bg-transparent border rounded px-2"
      >
        {Object.values(PlanStepStatus).map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="ml-2 text-red-500 hover:text-red-700"
      >
        ×
      </button>
    </div>
  );
};

const FlowManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { steps, activeStepId } = useAppSelector((state) => state.flow);
  const [newStepDescription, setNewStepDescription] = useState('');

  const handleStatusChange = (stepId: string, status: PlanStepStatus) => {
    dispatch(updateStepStatus({ stepId, status }));
  };

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepDescription.trim()) return;

    const newStep: FlowStep = {
      id: `step-${Date.now()}`,
      description: newStepDescription,
      status: PlanStepStatus.NOT_STARTED,
      agent: 'default', // You might want to make this configurable
      dependencies: [],
    };

    dispatch(addStep(newStep));
    setNewStepDescription('');
  };

  return (
    <div className="card p-6">
      <h2 className="text-2xl font-bold mb-4">Flow Management</h2>

      <form onSubmit={handleAddStep} className="mb-6 flex gap-2">
        <input
          type="text"
          value={newStepDescription}
          onChange={(e) => setNewStepDescription(e.target.value)}
          placeholder="Add new step..."
          className="input-field flex-1"
        />
        <button type="submit" className="btn-primary">
          Add Step
        </button>
      </form>

      <div className="space-y-2">
        {steps.map((step) => (
          <StepItem
            key={step.id}
            step={step}
            isActive={step.id === activeStepId}
            onStatusChange={(status) => handleStatusChange(step.id, status)}
            onSelect={() => dispatch(setActiveStep(step.id))}
            onRemove={() => dispatch(removeStep(step.id))}
          />
        ))}
      </div>

      {steps.length === 0 && (
        <p className="text-gray-500 text-center py-4">
          No steps in the current flow. Add steps to get started.
        </p>
      )}

      {activeStepId && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Dependencies</h3>
          <select
            multiple
            className="input-field w-full"
            value={
              steps.find((s) => s.id === activeStepId)?.dependencies || []
            }
            onChange={(e) => {
              const selectedOptions = Array.from(
                e.target.selectedOptions,
                (option) => option.value
              );
              dispatch(
                updateStepDependencies({
                  stepId: activeStepId,
                  dependencies: selectedOptions,
                })
              );
            }}
          >
            {steps
              .filter((s) => s.id !== activeStepId)
              .map((step) => (
                <option key={step.id} value={step.id}>
                  {step.description}
                </option>
              ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default FlowManagement;
