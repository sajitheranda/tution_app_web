'use client'

export default function PaymentStatus() {
  const payments = [
    { student: 'John Doe', month: 'January 2024', amount: '$200', status: 'paid' },
    { student: 'Jane Smith', month: 'January 2024', amount: '$200', status: 'pending' },
    { student: 'Mike Johnson', month: 'December 2023', amount: '$200', status: 'overdue' },
  ]

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Payment Status</h2>
      
      <div className="grid gap-4">
        {payments.map((payment, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{payment.student}</h3>
                <p className="text-gray-600">{payment.month}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{payment.amount}</p>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  payment.status === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : payment.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {payment.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}