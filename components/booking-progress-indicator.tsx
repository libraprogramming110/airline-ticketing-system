import {
  FaPlaneDeparture,
  FaUser,
  FaCheck,
  FaGift,
} from 'react-icons/fa6';

type BookingStep = 1 | 2 | 3 | 4;

type BookingProgressIndicatorProps = {
  currentStep: BookingStep;
};

export default function BookingProgressIndicator({ currentStep }: BookingProgressIndicatorProps) {
  const steps = [
    { icon: FaPlaneDeparture, label: 'Search Flights', step: 1 },
    { icon: FaUser, label: 'Passenger Details', step: 2 },
    { icon: FaGift, label: 'Add Ons', step: 3 },
    { icon: FaCheck, label: 'Confirmation', step: 4 },
  ];

  return (
    <div className="bg-white py-8">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-8 md:gap-6">
        {steps.map((step, index) => (
          <div key={step.step} className="flex items-center">
            <ProgressStep
              icon={step.icon}
              label={step.label}
              active={currentStep === step.step}
            />
            {index < steps.length - 1 && (
              <div className="h-0.5 w-16 border-t-2 border-dashed border-[#6c7aa5] md:w-24" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressStep({
  icon: Icon,
  label,
  active,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
          active
            ? 'bg-[#0047ab] text-white'
            : 'border-2 border-[#0047ab] bg-white text-[#0047ab]'
        }`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <span
        className={`text-sm ${
          active ? 'font-bold text-[#0047ab]' : 'font-semibold text-[#0047ab]'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

