// ===== USER EXPORTER CONFIGURATION =====

export const userBulkImport = {
  enabled: true,
  templateName: 'user_import_template',
  sampleData: [
    {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone_number: '+1234567890',
      national_id: '123456789',
      user_type: 'tenant',
      is_active: true
    }
  ],
  allowInvalidImport: false,
  skipValidationOnImport: false
}
